// backend/src/services/LessonService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class LessonService {
    constructor() {
        this.Lesson = db.Lesson;
        this.AcademicDiscipline = db.AcademicDiscipline;
        this.Instructor = db.Instructor;
        this.TrainingGroup = db.TrainingGroup;
        this.Cadet = db.Cadet;
        this.Attendance = db.Attendance;
    }

    async getAllLessons() {
        return await this.Lesson.findAll({
            include: [
                { model: this.AcademicDiscipline, as: 'academicDiscipline' }, // ВИПРАВЛЕНО
                { model: this.Instructor, as: 'instructor' },             // ВИПРАВЛЕНО
                { model: this.TrainingGroup, as: 'trainingGroup' },           // ВИПРАВЛЕНО
            ],
        });
    }

    async getLessonById(id) {
        const lesson = await this.Lesson.findByPk(id, {
            include: [
                { model: this.AcademicDiscipline, as: 'academicDiscipline' }, // ВИПРАВЛЕНО
                { model: this.Instructor, as: 'instructor' },             // ВИПРАВЛЕНО
                { model: this.TrainingGroup, as: 'trainingGroup' },           // ВИПРАВЛЕНО
            ],
        });
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }
        return lesson;
    }
    // ... решта методів залишаються без змін ...
    async createLesson(lessonData) {
        const { name, academicDisciplineId, instructorId, trainingGroupId, location, startTime, endTime } = lessonData;
        if (!name || !academicDisciplineId || !instructorId || !trainingGroupId || !location || !startTime || !endTime) {
            throw new AppError('All lesson fields are required', 400);
        }
        const discipline = await this.AcademicDiscipline.findByPk(academicDisciplineId);
        if (!discipline) throw new AppError('Academic Discipline not found', 404);
        const instructor = await this.Instructor.findByPk(instructorId);
        if (!instructor) throw new AppError('Instructor not found', 404);
        const trainingGroup = await this.TrainingGroup.findByPk(trainingGroupId);
        if (!trainingGroup) throw new AppError('Training Group not found', 404);
        const newLesson = await this.Lesson.create(lessonData);
        const cadets = await this.Cadet.findAll({ where: { trainingGroupId: trainingGroup.id } });
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
        const lesson = await this.getLessonById(id);
        if (updateData.academicDisciplineId) {
            const discipline = await this.AcademicDiscipline.findByPk(updateData.academicDisciplineId);
            if (!discipline) throw new AppError('Academic Discipline not found', 404);
        }
        if (updateData.instructorId) {
            const instructor = await this.Instructor.findByPk(updateData.instructorId);
            if (!instructor) throw new AppError('Instructor not found', 404);
        }
        if (updateData.trainingGroupId) {
            const trainingGroup = await this.TrainingGroup.findByPk(updateData.trainingGroupId);
            if (!trainingGroup) throw new AppError('Training Group not found', 404);
            await this.Attendance.destroy({ where: { lesson_id: lesson.id } });
            const cadets = await this.Cadet.findAll({ where: { trainingGroupId: updateData.trainingGroupId } });
            const attendanceRecords = cadets.map(cadet => ({
                lessonId: lesson.id,
                cadetId: cadet.id,
                status: 'Не відмічено',
            }));
            if (attendanceRecords.length > 0) {
                await this.Attendance.bulkCreate(attendanceRecords);
            }
        }
        await lesson.update(updateData);
        return lesson;
    }

    async deleteLesson(id) {
        const lesson = await this.getLessonById(id);
        await lesson.destroy();
        return { message: 'Lesson deleted successfully' };
    }
}

module.exports = new LessonService();