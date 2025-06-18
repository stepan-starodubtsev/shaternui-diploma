const sequelize = require('../config/settingsDB');
const TrainingSession = require('../models/trainingSession.model');
const SessionExercise = require('../models/sessionExercise.model');
const AppError = require("../errors/AppError");
const sessionExerciseService = require("./sessionExerciseService");
const standardAssessmentService = require("./standardAssessmentService");

module.exports = {
    async createTrainingSession(sessionData) {
        const { exercises, ...sessionDetails } = sessionData;
        const transaction = await sequelize.transaction();
        try {
            const newTrainingSession = await TrainingSession.create(sessionDetails, { transaction });

            if (exercises && exercises.length > 0) {
                const sessionExercisesData = exercises.map(ex => ({
                    session_id: newTrainingSession.session_id,
                    exercise_id: ex.exercise_id,
                    order_in_session: ex.order_in_session || 1
                }));
                await SessionExercise.bulkCreate(sessionExercisesData, { transaction });
            }

            await transaction.commit();
            return await this.getTrainingSessionById(newTrainingSession.session_id);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not create training session: ${error.message}`, 500);
        }
    },

    async getAllTrainingSessions(filters = {}) {
        const trainingSessions = await TrainingSession.findAll({
            where: filters,
            include: [{
                model: sequelize.models.Exercise,
                as: 'exercises',
                through: { attributes: ['order_in_session'] }
            }],
            order: [
                ['session_id', 'ASC']
            ]
        });
        if (!trainingSessions || trainingSessions.length === 0) {
            return null;
        }
        return trainingSessions;
    },

    async getTrainingSessionById(id) {
        const trainingSession = await TrainingSession.findByPk(id, {
            include: [{
                model: sequelize.models.Exercise,
                as: 'exercises',
                through: { attributes: ['order_in_session'] }
            }]
        });
        if (!trainingSession) {
            throw new AppError(`Training Session with ID ${id} not found`, 404);
        }
        return trainingSession;
    },

    async updateTrainingSession(id, updateData) {
        const { exercises, ...sessionDetails } = updateData;
        const transaction = await sequelize.transaction();
        try {
            const trainingSession = await TrainingSession.findByPk(id, { transaction });
            if (!trainingSession) {
                await transaction.rollback();
                throw new AppError(`Training Session with ID ${id} not found`, 404);
            }

            await trainingSession.update(sessionDetails, { transaction });

            if (exercises !== undefined) {
                await SessionExercise.destroy({ where: { session_id: id }, transaction });

                if (exercises.length > 0) {
                    const sessionExercisesData = exercises.map(ex => ({
                        session_id: id,
                        exercise_id: ex.exercise_id,
                        order_in_session: ex.order_in_session || 1
                    }));
                    await SessionExercise.bulkCreate(sessionExercisesData, { transaction });
                }
            }

            await transaction.commit();
            return await this.getTrainingSessionById(id);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not update training session: ${error.message}`, 500);
        }
    },

    async deleteTrainingSession(id, options = {}) {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            const trainingSession = await TrainingSession.findByPk(id, { transaction });
            if (!trainingSession) {
                if (!options.transaction) await transaction.rollback();
                throw new AppError(`Training Session with ID ${id} not found`, 404);
            }

            await sessionExerciseService.deleteSessionExercisesBySessionId(id, { transaction });
            await standardAssessmentService.deleteAssessmentsBySessionId(id, { transaction });

            await trainingSession.destroy({ transaction });

            if (!options.transaction) await transaction.commit();
            return { message: `Training Session with ID ${id} and its associated exercises/assessments deleted successfully` };
        } catch (error) {
            if (!options.transaction) await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete training session: ${error.message}`, 500);
        }
    }
};