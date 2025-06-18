// backend/src/models/Lesson.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Lesson = sequelize.define('Lesson', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING, // Text for location
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'start_time',
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'end_time',
        },
        // academicDisciplineId, instructorId, trainingGroupId are added via association
    }, {
        tableName: 'lessons',
        timestamps: true,
    });

    return Lesson;
};