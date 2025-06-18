// backend/src/services/AttendanceService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class AttendanceService {
    constructor() {
        this.Attendance = db.Attendance;
        this.Lesson = db.Lesson;
        this.Cadet = db.Cadet;
    }

    async getAllAttendances() {
        return await this.Attendance.findAll({

            order: [
                ['id', 'ASC']
            ],
            include: [
                {model: this.Lesson, as: 'lesson'}, // ВИПРАВЛЕНО
                {model: this.Cadet, as: 'cadet'},   // ВИПРАВЛЕНО
            ],
        });
    }

    async getAttendanceById(id) {
        const attendance = await this.Attendance.findByPk(id, {
            include: [
                {model: this.Lesson, as: 'lesson'}, // ВИПРАВЛЕНО
                {model: this.Cadet, as: 'cadet'},   // ВИПРАВЛЕНО
            ],
        });
        if (!attendance) {
            throw new AppError('Attendance record not found', 404);
        }
        return attendance;
    }

    async getAttendancesByLessonId(lessonId) {
        const lesson = await this.Lesson.findByPk(lessonId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }
        return await this.Attendance.findAll({
            where: {lesson_id: lessonId},
            include: [{model: this.Cadet, as: 'cadet'}] // ВИПРАВЛЕНО
        });
    }

    // ... решта методів залишаються без змін ...
    async createAttendance(attendanceData) {
        const {lessonId, cadetId, status} = attendanceData;
        if (!lessonId || !cadetId || !status) {
            throw new AppError('Lesson ID, Cadet ID, and status are required for attendance record', 400);
        }
        const lesson = await this.Lesson.findByPk(lessonId);
        if (!lesson) throw new AppError('Lesson not found', 404);
        const cadet = await this.Cadet.findByPk(cadetId);
        if (!cadet) throw new AppError('Cadet not found', 404);
        const newAttendance = await this.Attendance.create(attendanceData);
        return newAttendance;
    }

    async updateAttendanceStatus(id, newStatus) {
        const attendance = await this.getAttendanceById(id);
        if (!attendance) {
            throw new AppError('Attendance record not found', 404);
        }
        await attendance.update({status: newStatus});
        return attendance;
    }

    async deleteAttendance(id) {
        const attendance = await this.getAttendanceById(id);
        await attendance.destroy();
        return {message: 'Attendance record deleted successfully'};
    }
}

module.exports = new AttendanceService();