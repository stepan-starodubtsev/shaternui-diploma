// backend/src/services/LessonService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class LessonService {
    constructor() {
        this.Lesson = db.Lesson;
        this.AcademicDiscipline = db.AcademicDiscipline;
        this.Instructor = db.Instructor;
        this.EducationalGroup = db.EducationalGroup;
        this.Cadet = db.Cadet;
        this.Attendance = db.Attendance;
        this.sequelize = require('../config/settingsDB');
    }

    async getAllLessons(user) {
        const queryOptions = {
            order: [
                ['id', 'ASC']
            ],
            include: [
                {model: this.AcademicDiscipline, as: 'academicDiscipline'}, // ВИПРАВЛЕНО
                {model: this.Instructor, as: 'instructor'},             // ВИПРАВЛЕНО
                {model: this.EducationalGroup, as: 'educationalGroup'},           // ВИПРАВЛЕНО
                {
                    model: this.Attendance,
                    as: 'attendances',
                    include: [
                        {
                            model: this.Cadet,
                            as: 'cadet',
                        },
                    ],
                },
            ],
        };

        if (user.role === 'INSTRUCTOR') {
            // Перевіряємо, чи є у користувача прив'язаний ID викладача
            if (!user.instructorId) {
                // Якщо викладач не прив'язаний до акаунту, повертаємо порожній масив
                return [];
            }
            queryOptions.where = {instructorId: user.instructorId};
        }

        // Якщо роль ADMIN, умова where не додається, і повертаються всі заняття
        return await this.Lesson.findAll(queryOptions);
    }

    async getLessonById(id) {
        const lesson = await this.Lesson.findByPk(id, {
            include: [
                {model: this.AcademicDiscipline, as: 'academicDiscipline'},
                {model: this.Instructor, as: 'instructor'},
                {model: this.EducationalGroup, as: 'educationalGroup'},

                // --- ДОДАНО: Підключаємо відвідуваність та дані курсантів ---
                {
                    model: this.Attendance,
                    as: 'attendances',
                    include: [
                        {
                            model: this.Cadet,
                            as: 'cadet',
                        },
                    ],
                },
                // ---------------------------------------------------------
            ],
        });
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }
        return lesson;
    }

    // ... решта методів залишаються без змін ...
    async createLesson(lessonData) {
        const {name, academicDisciplineId, instructorId, educationalGroupId, location, startTime, endTime} = lessonData;
        if (!name || !academicDisciplineId || !instructorId || !educationalGroupId || !location || !startTime || !endTime) {
            throw new AppError('All lesson fields are required', 400);
        }
        const discipline = await this.AcademicDiscipline.findByPk(academicDisciplineId);
        if (!discipline) throw new AppError('Academic Discipline not found', 404);
        const instructor = await this.Instructor.findByPk(instructorId);
        if (!instructor) throw new AppError('Instructor not found', 404);
        const educationalGroup = await this.EducationalGroup.findByPk(educationalGroupId);
        if (!educationalGroup) throw new AppError('Educational Group not found', 404);
        const newLesson = await this.Lesson.create(lessonData);
        const cadets = await this.Cadet.findAll({where: {educationalGroupId: educationalGroup.id}});
        const attendanceRecords = cadets.map(cadet => ({
            lessonId: newLesson.id,
            cadetId: cadet.id,
            status: 'Не відмічено',
        }));
        if (attendanceRecords.length > 0) {
            await this.Attendance.bulkCreate(attendanceRecords);
        }
        return newLesson;
    }

    async updateLesson(id, updateData) {
        const {name, location, startTime, endTime, academicDisciplineId, instructorId, educationalGroupId} = updateData;

        const t = await this.sequelize.transaction();
        try {
            const lesson = await this.Lesson.findByPk(id, {transaction: t});
            if (!lesson) {
                throw new AppError('Lesson not found', 404);
            }

            // Зберігаємо поточний ID групи перед оновленням
            const originalGroupId = lesson.educationalGroupId;

            // 1. Оновлюємо основні дані заняття
            await lesson.update({
                name,
                location,
                startTime,
                endTime,
                academicDisciplineId,
                instructorId,
                educationalGroupId
            }, {transaction: t});

            // 2. Перевіряємо, чи БУЛА ЗМІНЕНА група
            if (educationalGroupId && educationalGroupId !== originalGroupId) {
                // Якщо так, то видаляємо старі відмітки...
                await this.Attendance.destroy({where: {lessonId: id}, transaction: t});

                // ...і створюємо нові для нової групи
                const cadets = await this.Cadet.findAll({
                    where: {educationalGroupId: educationalGroupId}
                });
                const attendanceRecords = cadets.map(cadet => ({
                    lessonId: lesson.id,
                    cadetId: cadet.id,
                    status: 'Не відмічено', // Статус за замовчуванням
                }));

                if (attendanceRecords.length > 0) {
                    await this.Attendance.bulkCreate(attendanceRecords, {transaction: t});
                }
            }

            await t.commit();
            return await this.getLessonById(id);
        } catch (error) {
            await t.rollback();
            throw new AppError(`Error updating lesson: ${error.message}`, 500);
        }
    }

    async deleteLesson(id) {
        const lesson = await this.getLessonById(id);
        await lesson.destroy();
        return {message: 'Lesson deleted successfully'};
    }
}

module.exports = new LessonService();