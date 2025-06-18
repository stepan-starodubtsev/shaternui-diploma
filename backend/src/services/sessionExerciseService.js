const SessionExercise = require('../models/sessionExercise.model');
const Exercise = require('../models/exercise.model');
const TrainingSession = require('../models/trainingSession.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');


module.exports = {
    async createSessionExercise(data) {
        const { session_id, exercise_id, order_in_session } = data;

        const existingEntry = await SessionExercise.findOne({
            where: { session_id, exercise_id }
        });
        if (existingEntry) {
            throw new AppError(`Exercise with ID ${exercise_id} is already assigned to session ID ${session_id}`, 400);
        }
        return await SessionExercise.create({
            session_id,
            exercise_id,
            order_in_session: order_in_session || 1
        });
    },

    async getAllSessionExercises(filters = {}) {
        const sessionExercises = await SessionExercise.findAll({
            where: filters,
            include: [
                { model: Exercise, as: 'exercise' },
                { model: TrainingSession, as: 'trainingSession' }
            ],
            order: [['order_in_session', 'ASC']]
        });
        if (!sessionExercises || sessionExercises.length === 0) {
            return null;
        }
        return sessionExercises;
    },

    async getSessionExerciseById(id) {
        const sessionExercise = await SessionExercise.findByPk(id, {
            include: [
                { model: Exercise, as: 'exercise' },
                { model: TrainingSession, as: 'trainingSession' }
            ]
        });
        if (!sessionExercise) {
            throw new AppError(`SessionExercise record with ID ${id} not found`, 404);
        }
        return sessionExercise;
    },

    async updateSessionExercise(id, updateData) {
        const sessionExercise = await SessionExercise.findByPk(id);
        if (!sessionExercise) {
            throw new AppError(`SessionExercise record with ID ${id} not found`, 404);
        }
        if (updateData.session_id && updateData.session_id !== sessionExercise.session_id) {
            throw new AppError("Cannot change session_id for an existing SessionExercise record. Recreate instead.", 400);
        }
        if (updateData.exercise_id && updateData.exercise_id !== sessionExercise.exercise_id) {
            throw new AppError("Cannot change exercise_id for an existing SessionExercise record. Recreate instead.", 400);
        }

        await sessionExercise.update(updateData);
        return sessionExercise;
    },

    async deleteSessionExercise(id, options = {}) {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            const sessionExercise = await SessionExercise.findByPk(id, { transaction });
            if (!sessionExercise) {
                if (!options.transaction) await transaction.rollback();
                throw new AppError(`SessionExercise record with ID ${id} not found`, 404);
            }
            await sessionExercise.destroy({ transaction });

            if (!options.transaction) await transaction.commit();
            return { message: `SessionExercise record with ID ${id} deleted successfully` };
        } catch (error) {
            if (!options.transaction) await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete SessionExercise record with ID ${id}: ${error.message}`, 500);
        }
    },

    async deleteSessionExercisesBySessionId(sessionId, options = {}) {
        const transaction = options.transaction;
        if (!transaction) {
            throw new AppError("Transaction is required for deleting session exercises by session ID", 500);
        }
        const result = await SessionExercise.destroy({
            where: { session_id: sessionId },
            transaction
        });
        return { message: `${result} exercise links for session ID ${sessionId} deleted successfully` };
    },

    async deleteSessionExercisesByExerciseId(exerciseId, options = {}) {
        const transaction = options.transaction;
        if (!transaction) {
            throw new AppError("Transaction is required for deleting session exercises by exercise ID", 500);
        }
        const result = await SessionExercise.destroy({
            where: { exercise_id: exerciseId },
            transaction
        });
        return { message: `${result} session links for exercise ID ${exerciseId} deleted successfully` };
    }
};