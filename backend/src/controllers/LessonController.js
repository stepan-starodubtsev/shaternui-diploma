// backend/src/controllers/LessonController.js
const lessonService = require('../services/LessonService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class LessonController {
    constructor() {
        this.getAllLessons = catchErrorAsync(this.getAllLessons.bind(this));
        this.getLessonById = catchErrorAsync(this.getLessonById.bind(this));
        this.createLesson = catchErrorAsync(this.createLesson.bind(this));
        this.updateLesson = catchErrorAsync(this.updateLesson.bind(this));
        this.deleteLesson = catchErrorAsync(this.deleteLesson.bind(this));
    }

    async getAllLessons(req, res) {
        // Передаємо req.user в сервіс для фільтрації
        const lessons = await lessonService.getAllLessons(req.user);
        res.status(200).json({ success: true, data: lessons });
    }

    async getLessonById(req, res) {
        const lesson = await lessonService.getLessonById(req.params.id);
        res.status(200).json({ success: true, data: lesson });
    }

    async createLesson(req, res) {
        const newLesson = await lessonService.createLesson(req.body);
        res.status(201).json({ success: true, data: newLesson });
    }

    async updateLesson(req, res) {
        const updatedLesson = await lessonService.updateLesson(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedLesson });
    }

    async deleteLesson(req, res) {
        const message = await lessonService.deleteLesson(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new LessonController();