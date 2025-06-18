const Location = require('../models/location.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');
const TrainingSessionModel = require('../models/trainingSession.model');

module.exports = {
    async createLocation(locationData) {
        const existingLocation = await Location.findOne({ where: { name: locationData.name } });
        if (existingLocation) {
            throw new AppError(`Location with name "${locationData.name}" already exists`, 400);
        }
        return await Location.create(locationData);
    },

    async getAllLocations() {
        const locations = await Location.findAll({
            order: [
                ['location_id', 'ASC']
            ]
        });
        if (!locations || locations.length === 0) {
            return null;
        }
        return locations;
    },

    async getLocationById(id) {
        const location = await Location.findByPk(id);
        if (!location) {
            throw new AppError(`Location with ID ${id} not found`, 404);
        }
        return location;
    },

    async updateLocation(id, updateData) {
        const location = await Location.findByPk(id);
        if (!location) {
            throw new AppError(`Location with ID ${id} not found`, 404);
        }
        if (updateData.name && updateData.name !== location.name) {
            const existingLocation = await Location.findOne({ where: { name: updateData.name } });
            if (existingLocation) {
                throw new AppError(`Location with name "${updateData.name}" already exists`, 400);
            }
        }
        await location.update(updateData);
        return location;
    },

    async deleteLocation(id, options = {}) {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            const location = await Location.findByPk(id, { transaction });
            if (!location) {
                if (!options.transaction) await transaction.rollback();
                throw new AppError(`Location with ID ${id} not found`, 404);
            }

            await TrainingSessionModel.update(
                { location_id: null },
                { where: { location_id: id }, transaction }
            );

            await location.destroy({ transaction });

            if (!options.transaction) await transaction.commit();
            return { message: `Location with ID ${id} deleted successfully. Associated training sessions have had their location set to null.` };
        } catch (error) {
            if (!options.transaction) await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete Location with ID ${id}: ${error.message}`, 500);
        }
    }
};