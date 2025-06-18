// backend/src/routes/lessonRouter.js
const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/LessonController');

// Define routes for Lesson
router.get('/', lessonController.getAllLessons);
router.get('/:id', lessonController.getLessonById);
router.post('/', lessonController.createLesson);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;