const trainingSessionService = require('../services/trainingSessionService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const filters = req.query;
        const sessions = await trainingSessionService.getAllTrainingSessions(filters);
        if (!sessions) {
            return res.json([]);
        }
        res.json(sessions);
    },

    async getById(req, res) {
        const session = await trainingSessionService.getTrainingSessionById(req.params.id);
        res.json(session);
    },

    async create(req, res) {
        const newSession = await trainingSessionService.createTrainingSession(req.body);
        res.status(201).json(newSession);
    },

    async update(req, res) {
        const updatedSession =
            await trainingSessionService.updateTrainingSession(req.params.id, req.body);
        res.json(updatedSession);
    },

    async delete(req, res) {
        const result = await trainingSessionService.deleteTrainingSession(req.params.id);
        res.status(204).json(result);
    }
};