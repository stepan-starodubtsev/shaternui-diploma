const militaryPersonnelService = require('../services/militaryPersonnelService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const filters = req.query;
        const personnelList = await militaryPersonnelService.getAllMilitaryPersonnel(filters);
        if (!personnelList) {
            return res.json([]);
        }
        res.json(personnelList);
    },

    async getById(req, res) {
        const personnel =
            await militaryPersonnelService.getMilitaryPersonnelById(req.params.id);
        res.json(personnel);
    },

    async create(req, res) {
        const newPersonnel =
            await militaryPersonnelService.createMilitaryPersonnel(req.body);
        res.status(201).json(newPersonnel);
    },

    async update(req, res) {
        const updatedPersonnel =
            await militaryPersonnelService.updateMilitaryPersonnel(req.params.id, req.body);
        res.json(updatedPersonnel);
    },

    async delete(req, res) {
        const result = await militaryPersonnelService.deleteMilitaryPersonnel(req.params.id);
        res.status(204).json(result);
    }
};