const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const StandardAssessment = sequelize.define('StandardAssessment', {
    assessment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'assessment_id'
    },
    session_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'session_id'
    },
    military_person_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'military_person_id'
    },
    exercise_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'exercise_id'
    },
    score: {
        type: DataTypes.ENUM(
            'PASSED',         // 'зараховано'
            'EXCELLENT',      // 'відмінно'
            'GOOD',           // 'добре'
            'SATISFACTORY',   // 'задовільно'
            'FAILED'          // 'не зараховано'
        ),
        allowNull: false,
        field: 'score'
    },
    assessment_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'assessment_datetime'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'notes'
    }
}, {
    tableName: 'standard_assessments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = StandardAssessment;