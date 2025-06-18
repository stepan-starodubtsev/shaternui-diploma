const Exercise = require('../models/exercise.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');
const sessionExerciseService = require('./sessionExerciseService');
const standardAssessmentService = require('./standardAssessmentService');

module.exports = {
    async createExercise(exerciseData) {
        const existingExercise = await Exercise.findOne({ where: { exercise_name: exerciseData.exercise_name } });
        if (existingExercise) {
            throw new AppError(`Exercise with name "${exerciseData.exercise_name}" already exists`, 400);
        }
        return await Exercise.create(exerciseData);
    },

    async getAllExercises() {
        const exercises = await Exercise.findAll({
            order: [
                ['exercise_id', 'ASC']
            ]
        });
        if (!exercises || exercises.length === 0) {
            return null;
        }
        return exercises;
    },

    async getExerciseById(id) {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) {
            throw new AppError(`Exercise with ID ${id} not found`, 404);
        }
        return exercise;
    },

    async updateExercise(id, updateData) {
        const exercise = await Exercise.findByPk(id);
        if (!exercise) {
            throw new AppError(`Exercise with ID ${id} not found`, 404);
        }
        if (updateData.exercise_name && updateData.exercise_name !== exercise.exercise_name) {
            const existingExercise = await Exercise.findOne({ where: { exercise_name: updateData.exercise_name } });
            if (existingExercise) {
                throw new AppError(`Exercise with name "${updateData.exercise_name}" already exists`, 400);
            }
        }
        await exercise.update(updateData);
        return exercise;
    },

    async deleteExercise(id, options = {}) {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            const exercise = await Exercise.findByPk(id, { transaction });
            if (!exercise) {
                if (!options.transaction) await transaction.rollback();
                throw new AppError(`Exercise with ID ${id} not found`, 404);
            }

            await sessionExerciseService.deleteSessionExercisesByExerciseId(id, { transaction });

            await standardAssessmentService.deleteAssessmentsByExerciseId(id, { transaction });

            await exercise.destroy({ transaction });

            if (!options.transaction) await transaction.commit();
            return { message: `Exercise with ID ${id} and associated links deleted successfully` };
        } catch (error) {
            if (!options.transaction) await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete Exercise with ID ${id}: ${error.message}`, 500);
        }
    }
};