// backend/src/controllers/AttendanceController.js
const attendanceService = require('../services/AttendanceService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class AttendanceController {
    constructor() {
        this.getAllAttendances = catchErrorAsync(this.getAllAttendances.bind(this));
        this.getAttendanceById = catchErrorAsync(this.getAttendanceById.bind(this));
        this.getAttendancesByLessonId = catchErrorAsync(this.getAttendancesByLessonId.bind(this));
        this.createAttendance = catchErrorAsync(this.createAttendance.bind(this));
        this.updateAttendanceStatus = catchErrorAsync(this.updateAttendanceStatus.bind(this));
        this.deleteAttendance = catchErrorAsync(this.deleteAttendance.bind(this));
    }

    async getAllAttendances(req, res) {
        const attendances = await attendanceService.getAllAttendances();
        res.status(200).json({ success: true, data: attendances });
    }

    async getAttendanceById(req, res) {
        const attendance = await attendanceService.getAttendanceById(req.params.id);
        res.status(200).json({ success: true, data: attendance });
    }

    async getAttendancesByLessonId(req, res) {
        const attendances = await attendanceService.getAttendancesByLessonId(req.params.lessonId);
        res.status(200).json({ success: true, data: attendances });
    }

    async createAttendance(req, res) {
        const newAttendance = await attendanceService.createAttendance(req.body);
        res.status(201).json({ success: true, data: newAttendance });
    }

    // This will be the primary endpoint for instructors to mark attendance
    async updateAttendanceStatus(req, res) {
        const { status } = req.body;
        const updatedAttendance = await attendanceService.updateAttendanceStatus(req.params.id, status);
        res.status(200).json({ success: true, data: updatedAttendance });
    }

    async deleteAttendance(req, res) {
        const message = await attendanceService.deleteAttendance(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new AttendanceController();