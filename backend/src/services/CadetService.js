// backend/src/services/CadetService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class CadetService {
    constructor() {
        this.Cadet = db.Cadet;
        this.TrainingGroup = db.TrainingGroup;
    }

    async getAllCadets() {
        return await this.Cadet.findAll({
            order: [
                ['id', 'ASC']
            ],
            include: [{model: this.TrainingGroup, as: 'trainingGroup'}] // ВИПРАВЛЕНО
        });
    }

    async getCadetById(id) {
        const cadet = await this.Cadet.findByPk(id, {
            include: [{model: this.TrainingGroup, as: 'trainingGroup'}] // ВИПРАВЛЕНО
        });
        if (!cadet) {
            throw new AppError('Cadet not found', 404);
        }
        return cadet;
    }

    async createCadet(cadetData) {
        if (!cadetData.fullName || !cadetData.rank || !cadetData.position || !cadetData.trainingGroupId) {
            throw new AppError('Full name, rank, position, and training group are required for Cadet', 400);
        }
        const trainingGroup = await this.TrainingGroup.findByPk(cadetData.trainingGroupId);
        if (!trainingGroup) {
            throw new AppError('Training Group not found', 404);
        }
        const newCadet = await this.Cadet.create(cadetData);
        return newCadet;
    }

    async updateCadet(id, updateData) {
        const cadet = await this.getCadetById(id);
        if (updateData.trainingGroupId) {
            const trainingGroup = await this.TrainingGroup.findByPk(updateData.trainingGroupId);
            if (!trainingGroup) {
                throw new AppError('Training Group not found', 404);
            }
        }
        await cadet.update(updateData);
        return cadet;
    }

    async deleteCadet(id) {
        const cadet = await this.getCadetById(id);
        await cadet.destroy();
        return {message: 'Cadet deleted successfully'};
    }
}

module.exports = new CadetService();