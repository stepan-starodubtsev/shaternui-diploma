// backend/src/models/EducationalGroup.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EducationalGroup = sequelize.define('EducationalGroup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Group names should be unique
        },
    }, {
        tableName: 'educational_groups',
        timestamps: true,
    });

    return EducationalGroup;
};