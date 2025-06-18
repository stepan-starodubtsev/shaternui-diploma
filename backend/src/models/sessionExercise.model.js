const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const SessionExercise = sequelize.define('SessionExercise', {
    session_exercise_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'session_exercise_id'
    },
    session_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'session_id'
    },
    exercise_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'exercise_id'
    },
    order_in_session: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'order_in_session'
    }
}, {
    tableName: 'session_exercises',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SessionExercise;