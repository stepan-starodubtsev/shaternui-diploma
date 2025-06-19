// backend/src/routes/lessonRouter.js
const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/LessonController');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.use(authMiddleware);

// Адмін може робити все
router.post('/', roleMiddleware(['ADMIN']), lessonController.createLesson);
router.put('/:id', roleMiddleware(['ADMIN', 'INSTRUCTOR']), lessonController.updateLesson);
router.delete('/:id', roleMiddleware(['ADMIN']), lessonController.deleteLesson);

// Переглядати можуть обидві ролі
router.get('/', roleMiddleware(['ADMIN', 'INSTRUCTOR']), lessonController.getAllLessons);
router.get('/:id', roleMiddleware(['ADMIN', 'INSTRUCTOR']), lessonController.getLessonById);

module.exports = router;