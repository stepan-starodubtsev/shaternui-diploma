const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const TrainingSession = sequelize.define('TrainingSession', {
    session_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'session_id'
    },
    session_type: {
        type: DataTypes.ENUM('TRAINING', 'STANDARDS_ASSESSMENT', 'UNIT_TRAINING'),
        allowNull: false,
        field: 'session_type'
    },
    start_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_datetime'
    },
    end_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_datetime'
    },
    location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'location_id'
    },
    conducted_by_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'conducted_by_user_id'
    },
    unit_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'unit_id'
    }
}, {
    tableName: 'training_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = TrainingSession;