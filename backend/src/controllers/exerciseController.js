const exerciseService = require('../services/exerciseService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const exercises = await exerciseService.getAllExercises();
        if (!exercises) {
            return res.json([]);
        }
        res.json(exercises);
    },

    async getById(req, res) {
        const exercise = await exerciseService.getExerciseById(req.params.id);
        res.json(exercise);
    },

    async create(req, res) {
        const newExercise = await exerciseService.createExercise(req.body);
        res.status(201).json(newExercise);
    },

    async update(req, res) {
        const updatedExercise = await exerciseService.updateExercise(req.params.id, req.body);
        res.json(updatedExercise);
    },

    async delete(req, res) {
        const result = await exerciseService.deleteExercise(req.params.id);
        res.status(204).json(result);
    }
};