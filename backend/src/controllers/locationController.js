const locationService = require('../services/locationService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const locations = await locationService.getAllLocations();
        if (!locations) {
            return res.json([]);
        }
        res.json(locations);
    },

    async getById(req, res) {
        const location = await locationService.getLocationById(req.params.id);
        res.json(location);
    },

    async create(req, res) {
        const newLocation = await locationService.createLocation(req.body);
        res.status(201).json(newLocation);
    },

    async update(req, res) {
        const updatedLocation = await locationService.updateLocation(req.params.id, req.body);
        res.json(updatedLocation);
    },

    async delete(req, res) {
        const result = await locationService.deleteLocation(req.params.id);
        res.status(204).json(result);
    }
};