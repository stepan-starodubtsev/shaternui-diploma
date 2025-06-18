// backend/src/models/TrainingGroup.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TrainingGroup = sequelize.define('TrainingGroup', {
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
        tableName: 'training_groups',
        timestamps: true,
    });

    return TrainingGroup;
};