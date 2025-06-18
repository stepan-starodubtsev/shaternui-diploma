// backend/src/models/AcademicDiscipline.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AcademicDiscipline = sequelize.define('AcademicDiscipline', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Discipline names should be unique
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'academic_disciplines',
        timestamps: true,
    });

    return AcademicDiscipline;
};