const MilitaryPersonnel = require('../models/militaryPersonnel.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');
const standardAssessmentService = require('./standardAssessmentService');

module.exports = {
    async createMilitaryPersonnel(personnelData) {
        return await MilitaryPersonnel.create(personnelData);
    },

    async getAllMilitaryPersonnel(filters = {}) {
        const militaryPersonnel = await MilitaryPersonnel.findAll({
            where: filters,
            order: [
                ['military_person_id', 'ASC']
            ]
        });
        if (!militaryPersonnel || militaryPersonnel.length === 0) {
            return null;
        }
        return militaryPersonnel;
    },

    async getMilitaryPersonnelById(id) {
        const militaryPersonnel = await MilitaryPersonnel.findByPk(id);
        if (!militaryPersonnel) {
            throw new AppError(`Military Personnel with ID ${id} not found`, 404);
        }
        return militaryPersonnel;
    },

    async updateMilitaryPersonnel(id, updateData) {
        const militaryPersonnel = await MilitaryPersonnel.findByPk(id);
        if (!militaryPersonnel) {
            throw new AppError(`Military Personnel with ID ${id} not found`, 404);
        }
        await militaryPersonnel.update(updateData);
        return militaryPersonnel;
    },

    async deleteMilitaryPersonnel(id, options = {}) {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            const militaryPersonnel = await MilitaryPersonnel.findByPk(id, { transaction });
            if (!militaryPersonnel) {
                if (!options.transaction) await transaction.rollback();
                throw new AppError(`Military Personnel with ID ${id} not found`, 404);
            }

            await standardAssessmentService.deleteAssessmentsByMilitaryPersonnelId(id, { transaction });

            await militaryPersonnel.destroy({ transaction });

            if (!options.transaction) await transaction.commit();
            return { message: `Military Personnel with ID ${id} and associated assessments deleted successfully` };
        } catch (error) {
            if (!options.transaction) await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete Military Personnel with ID ${id}: ${error.message}`, 500);
        }
    }
};