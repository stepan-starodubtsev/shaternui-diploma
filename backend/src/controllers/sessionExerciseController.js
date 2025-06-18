const sessionExerciseService = require('../services/sessionExerciseService');
const AppError = require('../errors/AppError');

module.exports = {
    async getBySessionId(req, res) {
        const { sessionId } = req.params;
        const sessionExercises = await sessionExerciseService.getAllSessionExercises({ session_id: sessionId });
        if (!sessionExercises) {
            return res.json([]);
        }
        res.json(sessionExercises);
    },

    async addExerciseToSession(req, res) {
        const newEntry = await sessionExerciseService.createSessionExercise(req.body);
        res.status(201).json(newEntry);
    },

    async updateExerciseInSession(req, res) {
        const updatedEntry = await sessionExerciseService.updateSessionExercise(req.params.id, req.body);
        res.json(updatedEntry);
    },

    async removeExerciseFromSessionById(req, res) {
        const result = await sessionExerciseService.deleteSessionExercise(req.params.id);
        res.status(204).json(result);
    }
};