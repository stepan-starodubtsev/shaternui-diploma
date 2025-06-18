const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const MilitaryPersonnel = sequelize.define('MilitaryPersonnel', {
    military_person_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'military_person_id'
    },
    first_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'first_name'
    },
    last_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'last_name'
    },
    rank: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'rank'
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'date_of_birth'
    },
    unit_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'unit_id'
    }
}, {
    tableName: 'military_personnel',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MilitaryPersonnel;