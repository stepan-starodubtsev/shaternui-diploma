const unitService = require('../services/unitService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const units = await unitService.getAllUnits();
        if (!units) {
            return res.json([]);
        }
        res.json(units);
    },

    async getById(req, res) {
        const unit = await unitService.getUnitById(req.params.id);
        res.json(unit);
    },

    async create(req, res) {
        const newUnit = await unitService.createUnit(req.body);
        res.status(201).json(newUnit);
    },

    async update(req, res) {
        const updatedUnit = await unitService.updateUnit(req.params.id, req.body);
        res.json(updatedUnit);
    },

    async delete(req, res) {
        const result = await unitService.deleteUnit(req.params.id);
        res.status(204).json(result);
    }
};