// backend/src/models/Attendance.model.js
const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Attendance = sequelize.define('Attendance', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(
                    'Прибув',
                    'Хворий',
                    'Наряд',
                    'Відрядження',
                    'Відпустка',
                    'Не відмічено' // Додамо цей статус
                ),
                allowNull: false,
                defaultValue: 'Не відмічено',
            },
            lessonId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'lesson_id',
            },
            cadetId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'cadet_id',
            }
            // lessonId та cadetId визначаються через зв'язки в index.js
        },
        {
            tableName: 'attendances',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    // Використовуємо snake_case, як і в базі даних
                    fields: ['lesson_id', 'cadet_id']
                }
            ]
        });

    return Attendance;
};