// backend/src/routes/attendanceRouter.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

// Define routes for Attendance
router.get('/', attendanceController.getAllAttendances);
router.get('/:id', attendanceController.getAttendanceById);
router.get('/lesson/:lessonId', attendanceController.getAttendancesByLessonId); // New route to get attendances for a specific lesson
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendanceStatus); // For updating status
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;