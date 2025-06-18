const StandardAssessment = require('../models/standardAssessment.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');


module.exports = {
    async createStandardAssessment(assessmentData) {
        const existingAssessment = await StandardAssessment.findOne({
            where: {
                session_id: assessmentData.session_id,
                military_person_id: assessmentData.military_person_id,
                exercise_id: assessmentData.exercise_id
            }
        });
        if (existingAssessment) {
            throw new AppError(`Assessment for this exercise (ID: ${assessmentData.exercise_id}), person (ID: ${assessmentData.military_person_id}), and session (ID: ${assessmentData.session_id}) already exists. Consider updating.`, 400);
        }
        return await StandardAssessment.create(assessmentData);
    },

    async getAllStandardAssessments(filters = {}) {
        const includeOptions = [
            { model: sequelize.models.TrainingSession, as: 'trainingSession' },
            { model: sequelize.models.MilitaryPersonnel, as: 'militaryPersonnel' },
            { model: sequelize.models.Exercise, as: 'exerciseDetails' }
        ];

        const assessments = await StandardAssessment.findAll({
            where: filters,
            order: [
                ['assessment_id', 'ASC']
            ]
        });
        if (!assessments || assessments.length === 0) {
            return null;
        }
        return assessments;
    },

    async getStandardAssessmentById(id) {
        const assessment = await StandardAssessment.findByPk(id, {
        });
        if (!assessment) {
            throw new AppError(`Standard Assessment with ID ${id} not found`, 404);
        }
        return assessment;
    },

    async updateStandardAssessment(id, updateData) {
        const assessment = await StandardAssessment.findByPk(id);
        if (!assessment) {
            throw new AppError(`Standard Assessment with ID ${id} not found`, 404);
        }
        if (updateData.session_id && updateData.session_id !== assessment.session_id) {
            throw new AppError("Cannot change session_id for an existing assessment. Recreate instead.", 400);
        }

        await assessment.update(updateData);
        return assessment;
    },

    async deleteStandardAssessment(id, options = {}) {
        const transaction = options.transaction || await sequelize.transaction();
        try {
            const assessment = await StandardAssessment.findByPk(id, { transaction });
            if (!assessment) {
                if (!options.transaction) await transaction.rollback();
                throw new AppError(`Standard Assessment with ID ${id} not found`, 404);
            }
            await assessment.destroy({ transaction });

            if (!options.transaction) await transaction.commit();
            return { message: `Standard Assessment with ID ${id} deleted successfully` };
        } catch (error) {
            if (!options.transaction) await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete Standard Assessment with ID ${id}: ${error.message}`, 500);
        }
    },

    async deleteAssessmentsBySessionId(sessionId, options = {}) {
        const transaction = options.transaction;
        if (!transaction) {
            throw new AppError("Transaction is required for deleting assessments by session ID", 500);
        }
        const result = await StandardAssessment.destroy({
            where: { session_id: sessionId },
            transaction
        });
        return { message: `${result} assessments for session ID ${sessionId} deleted successfully` };
    },

    async deleteAssessmentsByMilitaryPersonnelId(militaryPersonId, options = {}) {
        const transaction = options.transaction;
        if (!transaction) {
            throw new AppError("Transaction is required for deleting assessments by military person ID", 500);
        }
        const result = await StandardAssessment.destroy({
            where: { military_person_id: militaryPersonId },
            transaction
        });
        return { message: `${result} assessments for military person ID ${militaryPersonId} deleted successfully` };
    },

    async deleteAssessmentsByExerciseId(exerciseId, options = {}) {
        const transaction = options.transaction;
        if (!transaction) {
            throw new AppError("Transaction is required for deleting assessments by exercise ID", 500);
        }
        const result = await StandardAssessment.destroy({
            where: { exercise_id: exerciseId },
            transaction
        });
        return { message: `${result} assessments for exercise ID ${exerciseId} deleted successfully` };
    }
};