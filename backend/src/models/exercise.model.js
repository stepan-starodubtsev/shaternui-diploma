const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const Exercise = sequelize.define('Exercise', {
    exercise_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'exercise_id'
    },
    exercise_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: 'exercise_name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    }
}, {
    tableName: 'exercises',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Exercise;