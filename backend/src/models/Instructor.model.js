// backend/src/models/Instructor.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Instructor = sequelize.define('Instructor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'full_name', // Database column name
        },
        rank: {
            type: DataTypes.ENUM(
                'солдат', 'старший солдат', 'молодший сержант', 'сержант', 'старший сержант',
                'головний сержант', 'штаб-сержант', 'майстер-сержант', 'старший майстер-сержант',
                'головний майстер-сержант', // Рядовий та сержантський склад ЗСУ
                'молодший лейтенант', 'лейтенант', 'старший лейтенант', 'капітан',
                'майор', 'підполковник', 'полковник', 'бригадний генерал',
                'генерал-майор', 'генерал-лейтенант', 'генерал' // Офіцерський склад ЗСУ
            ),
            allowNull: true, // Optional for civilian instructors
        },
        academicDegree: {
            type: DataTypes.ENUM(
                'кандидат наук', // До 2021 року
                'доктор філософії', // Після 2021 року
                'доктор наук'
            ),
            allowNull: true,
            field: 'academic_degree',
        },
        position: {
            type: DataTypes.ENUM(
                'Викладач кафедри',
                'Старший викладач кафедри',
                'Доцент кафедри',
                'Професор кафедри',
                'Заступник начальника кафедри',
                'Начальник кафедри'
            ),
            allowNull: false,
        },
    }, {
        tableName: 'instructors',
        timestamps: true,
    });

    return Instructor;
};