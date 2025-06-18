// backend/src/models/Cadet.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Cadet = sequelize.define('Cadet', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'full_name',
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
            allowNull: false,
        },
        position: {
            type: DataTypes.ENUM('Курсант', 'Командир групи'),
            allowNull: false,
        },
        // trainingGroupId is added via association in index.js
    }, {
        tableName: 'cadets',
        timestamps: true,
    });

    return Cadet;
};