const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const Location = sequelize.define('Location', {
    location_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'location_id'
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: 'name'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    }
}, {
    tableName: 'locations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Location;