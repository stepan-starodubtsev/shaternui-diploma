// backend/src/controllers/TrainingGroupController.js
const trainingGroupService = require('../services/TrainingGroupService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class TrainingGroupController {
    constructor() {
        this.getAllTrainingGroups = catchErrorAsync(this.getAllTrainingGroups.bind(this));
        this.getTrainingGroupById = catchErrorAsync(this.getTrainingGroupById.bind(this));
        this.createTrainingGroup = catchErrorAsync(this.createTrainingGroup.bind(this));
        this.updateTrainingGroup = catchErrorAsync(this.updateTrainingGroup.bind(this));
        this.deleteTrainingGroup = catchErrorAsync(this.deleteTrainingGroup.bind(this));
    }

    async getAllTrainingGroups(req, res) {
        const groups = await trainingGroupService.getAllTrainingGroups();
        res.status(200).json({ success: true, data: groups });
    }

    async getTrainingGroupById(req, res) {
        const group = await trainingGroupService.getTrainingGroupById(req.params.id);
        res.status(200).json({ success: true, data: group });
    }

    async createTrainingGroup(req, res) {
        const newGroup = await trainingGroupService.createTrainingGroup(req.body);
        res.status(201).json({ success: true, data: newGroup });
    }

    async updateTrainingGroup(req, res) {
        const updatedGroup = await trainingGroupService.updateTrainingGroup(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedGroup });
    }

    async deleteTrainingGroup(req, res) {
        const message = await trainingGroupService.deleteTrainingGroup(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new TrainingGroupController();