// backend/src/models/index.js
const { Sequelize } = require('sequelize');
const sequelize = require('../config/settingsDB');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 1. Завантаження всіх моделей
db.Instructor = require('./Instructor.model')(sequelize);
db.User = require('./User.model')(sequelize);
db.Cadet = require('./Cadet.model')(sequelize);
db.EducationalGroup = require('./EducationalGroup.model')(sequelize);
db.AcademicDiscipline = require('./AcademicDiscipline.model')(sequelize);
db.Lesson = require('./Lesson.model')(sequelize);
db.Attendance = require('./Attendance.model')(sequelize);

// 2. Визначення всіх зв'язків
// Це правильне місце для визначення зв'язків,
// оскільки всі моделі вже завантажені в об'єкт db.

// Instructor <-> User (One-to-One)
db.Instructor.hasOne(db.User, {
    foreignKey: { name: 'instructorId', field: 'instructor_id' },
    as: 'userAccount',
    onDelete: 'SET NULL'
});
db.User.belongsTo(db.Instructor, {
    foreignKey: { name: 'instructorId', field: 'instructor_id' },
    as: 'instructorProfile'
});

// EducationalGroup <-> Cadet (One-to-Many)
db.EducationalGroup.hasMany(db.Cadet, {
    foreignKey: { name: 'educationalGroupId', field: 'educational_group_id' },
    as: 'cadets',
    onDelete: 'SET NULL'
});
db.Cadet.belongsTo(db.EducationalGroup, {
    foreignKey: { name: 'educationalGroupId', field: 'educational_group_id' },
    as: 'educationalGroup'
});

// Instructor <-> Lesson (One-to-Many)
db.Instructor.hasMany(db.Lesson, {
    foreignKey: { name: 'instructorId', field: 'instructor_id' },
    as: 'lessons',
    onDelete: 'SET NULL'
});
db.Lesson.belongsTo(db.Instructor, {
    foreignKey: { name: 'instructorId', field: 'instructor_id' },
    as: 'instructor'
});

// EducationalGroup <-> Lesson (One-to-Many)
db.EducationalGroup.hasMany(db.Lesson, {
    foreignKey: { name: 'educationalGroupId', field: 'educational_group_id' },
    as: 'lessons',
    onDelete: 'SET NULL'
});
db.Lesson.belongsTo(db.EducationalGroup, {
    foreignKey: { name: 'educationalGroupId', field: 'educational_group_id' },
    as: 'educationalGroup'
});

// AcademicDiscipline <-> Lesson (One-to-Many)
db.AcademicDiscipline.hasMany(db.Lesson, {
    foreignKey: { name: 'academicDisciplineId', field: 'academic_discipline_id' },
    as: 'lessons',
    onDelete: 'SET NULL'
});
db.Lesson.belongsTo(db.AcademicDiscipline, {
    foreignKey: { name: 'academicDisciplineId', field: 'academic_discipline_id' },
    as: 'academicDiscipline'
});

// Lesson <-> Attendance (One-to-Many)
db.Lesson.hasMany(db.Attendance, {
    foreignKey: { name: 'lessonId', field: 'lesson_id' },
    as: 'attendances',
    onDelete: 'CASCADE'
});
db.Attendance.belongsTo(db.Lesson, {
    foreignKey: { name: 'lessonId', field: 'lesson_id' },
    as: 'lesson'
});

// Cadet <-> Attendance (One-to-Many)
db.Cadet.hasMany(db.Attendance, {
    foreignKey: { name: 'cadetId', field: 'cadet_id' },
    as: 'attendances',
    onDelete: 'CASCADE'
});
db.Attendance.belongsTo(db.Cadet, {
    foreignKey: { name: 'cadetId', field: 'cadet_id' },
    as: 'cadet'
});

module.exports = db;