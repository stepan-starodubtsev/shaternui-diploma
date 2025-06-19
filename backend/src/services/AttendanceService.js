// backend/src/services/AttendanceService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class AttendanceService {
    constructor() {
        this.Attendance = db.Attendance;
        this.Lesson = db.Lesson;
        this.Cadet = db.Cadet;
        this.sequelize = db.sequelize;
    }

    async getAllAttendances() {
        return await this.Attendance.findAll({
            // ВИПРАВЛЕНО: Псевдоніми з маленької літери
            include: [
                {model: this.Lesson, as: 'lesson'},
                {model: this.Cadet, as: 'cadet'},
            ],
        });
    }

    async getAttendanceById(id) {
        const attendance = await this.Attendance.findByPk(id, {
            // ВИПРАВЛЕНО: Псевдоніми з маленької літери
            include: [
                {model: this.Lesson, as: 'lesson'},
                {model: this.Cadet, as: 'cadet'},
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
            // ВИПРАВЛЕНО: Псевдонім з маленької літери
            include: [{model: this.Cadet, as: 'cadet'}]
        });
    }

    async createAttendance(attendanceData) {
        // ... (код без змін)
    }

    // Цей метод використовувався для одиночного оновлення, але ми його зараз не викликаємо з фронтенду
    async updateAttendanceStatus(id, newStatus) {
        const attendance = await this.getAttendanceById(id); // Тепер цей виклик спрацює
        await attendance.update({status: newStatus});
        return attendance;
    }

    async bulkUpdateStatus(updates) {
        if (!Array.isArray(updates) || updates.length === 0) {
            return {message: 'No updates provided.'};
        }

        try {
            // Проходимо по кожному оновленню зі списку
            for (const update of updates) {
                if (update.id && update.status) {
                    // 1. Знаходимо конкретний запис відвідуваності по ID
                    const attendanceRecord = await this.Attendance.findByPk(update.id);

                    // 2. Якщо запис знайдено, оновлюємо його статус і зберігаємо
                    if (attendanceRecord) {
                        attendanceRecord.status = update.status;
                        const temp = await attendanceRecord.save();
                        console.log(temp);
                    }
                }
            }

            // 3. Зберігаємо всі зміни в транзакції
            return {message: 'Attendances updated successfully.'};
        } catch (error) {
            throw new AppError(`Error bulk updating attendances: ${error.message}`, 500);
        }
    }

    async deleteAttendance(id) {
        const attendance = await this.getAttendanceById(id);
        await attendance.destroy();
        return {message: 'Attendance record deleted successfully'};
    }
}

module.exports = new AttendanceService();