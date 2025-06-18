const standardAssessmentService = require('../services/standardAssessmentService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const filters = req.query;
        const assessments = await standardAssessmentService.getAllStandardAssessments(filters);
        if (!assessments) {
            return res.json([]);
        }
        res.json(assessments);
    },

    async getById(req, res) {
        const assessment = await standardAssessmentService.getStandardAssessmentById(req.params.id);
        res.json(assessment);
    },

    async create(req, res) {
        const newAssessment =
            await standardAssessmentService.createStandardAssessment(req.body);
        res.status(201).json(newAssessment);
    },

    async update(req, res) {
        const updatedAssessment =
            await standardAssessmentService.updateStandardAssessment(req.params.id, req.body);
        res.json(updatedAssessment);
    },

    async delete(req, res) {
        const result = await standardAssessmentService.deleteStandardAssessment(req.params.id);
        res.status(204).json(result);
    }
};