// backend/src/services/TrainingGroupService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class TrainingGroupService {
    constructor() {
        this.TrainingGroup = db.TrainingGroup;
        this.Cadet = db.Cadet; // To include cadets in group fetch
    }

    async getAllTrainingGroups() {
        return await this.TrainingGroup.findAll({
            order: [
                ['id', 'ASC']
            ],
            include: [{model: this.Cadet, as: 'cadets'}]
        });
    }

    async getTrainingGroupById(id) {
        const group = await this.TrainingGroup.findByPk(id, {
            include: [{model: this.Cadet, as: 'cadets'}]
        });
        if (!group) {
            throw new AppError('Training Group not found', 404);
        }
        return group;
    }

    async createTrainingGroup(groupData) {
        if (!groupData.name) {
            throw new AppError('Group name is required', 400);
        }
        const newGroup = await this.TrainingGroup.create(groupData);
        return newGroup;
    }

    async updateTrainingGroup(id, updateData) {
        const group = await this.getTrainingGroupById(id);
        await group.update(updateData);
        return group;
    }

    async deleteTrainingGroup(id) {
        const group = await this.getTrainingGroupById(id);
        // Check if there are any cadets associated with this group
        const cadetsInGroup = await this.Cadet.count({where: {trainingGroupId: id}});
        if (cadetsInGroup > 0) {
            throw new AppError('Cannot delete training group with associated cadets. Please reassign or delete cadets first.', 400);
        }
        await group.destroy();
        return {message: 'Training Group deleted successfully'};
    }
}

module.exports = new TrainingGroupService();