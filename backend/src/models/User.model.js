// backend/src/models/User.model.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'INSTRUCTOR'),
            allowNull: false,
            defaultValue: 'INSTRUCTOR',
        },
        // Поле instructorId залишається, але без 'references'.
        // Зв'язок буде створено в 'index.js'.
        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
        },
    }, {
        tableName: 'users',
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password') && user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    });

    User.prototype.isValidPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;
};