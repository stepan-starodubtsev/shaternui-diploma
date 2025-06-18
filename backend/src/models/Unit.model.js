const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const Unit = sequelize.define('Unit', {
    unit_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'unit_id'
    },
    unit_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: 'unit_name'
    }
}, {
    tableName: 'units',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Unit;