// backend/src/routes/attendanceRouter.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
// Define routes for Attendance
router.use(authMiddleware);
router.get('/', attendanceController.getAllAttendances);
router.get('/lesson/:lessonId', attendanceController.getAttendancesByLessonId);

// ВИПРАВЛЕНО: Більш конкретний маршрут /bulk-update тепер стоїть ПЕРЕД /:id
router.put('/bulk-update', roleMiddleware(['ADMIN', 'INSTRUCTOR']), attendanceController.bulkUpdateStatus);

router.get('/:id', attendanceController.getAttendanceById);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendanceStatus); // Цей маршрут тепер на правильному місці
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;