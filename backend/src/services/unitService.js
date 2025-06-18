const { Unit, User, MilitaryPersonnel, TrainingSession } = require('../models');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');

const militaryPersonnelService = require('./militaryPersonnelService');
const trainingSessionService = require('./trainingSessionService');
const userService = require('./userService');

module.exports = {
    async createUnit(unitData) {
        const existingUnit = await Unit.findOne({ where: { unit_name: unitData.unit_name } });
        if (existingUnit) {
            throw new AppError(`Unit with name "${unitData.unit_name}" already exists`, 400);
        }
        return await Unit.create(unitData);
    },

    async getAllUnits() {
        const units = await Unit.findAll({
            order: [
                ['unit_id', 'ASC']
            ]
        });
        if (!units || units.length === 0) {
            return null;
        }
        return units;
    },

    async getUnitById(id) {
        const unitInstance = await Unit.findByPk(id, {
        });
        if (!unitInstance) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }
        return unitInstance;
    },

    async updateUnit(id, updateData) {
        const unitInstance = await Unit.findByPk(id);
        if (!unitInstance) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }
        if (updateData.unit_name && updateData.unit_name !== unitInstance.unit_name) {
            const existingUnit = await Unit.findOne({ where: { unit_name: updateData.unit_name } });
            if (existingUnit) {
                throw new AppError(`Unit with name "${updateData.unit_name}" already exists`, 400);
            }
        }
        await unitInstance.update(updateData);
        return unitInstance;
    },

    async deleteUnit(id) {
        const unitInstance = await Unit.findByPk(id);
        if (!unitInstance) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }

        const transaction = await sequelize.transaction();
        try {
            const usersInUnit = await userService.getAllUsers({ unit_id: id });
            if (usersInUnit && usersInUnit.length > 0) {
                for (const user of usersInUnit) {
                    await userService.updateUser(user.user_id, { unit_id: null }, { transaction });
                }
            }

            const personnelInUnit = await militaryPersonnelService.getAllMilitaryPersonnel({ unit_id: id });
            if (personnelInUnit && personnelInUnit.length > 0) {
                for (const person of personnelInUnit) {
                    await militaryPersonnelService.deleteMilitaryPersonnel(person.military_person_id, { transaction });
                }
            }

            const sessionsInUnit = await trainingSessionService.getAllTrainingSessions({ unit_id: id });
            if (sessionsInUnit && sessionsInUnit.length > 0) {
                for (const session of sessionsInUnit) {
                    await trainingSessionService.deleteTrainingSession(session.session_id, { transaction });
                }
            }

            await unitInstance.destroy({ transaction });

            await transaction.commit();
            return { message: `Unit with ID ${id} and all associated data deleted successfully` };
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            console.error('Error in deleteUnit service:', error);
            throw new AppError(`Could not delete Unit with ID ${id}: ${error.message}`, 500);
        }
    }
};