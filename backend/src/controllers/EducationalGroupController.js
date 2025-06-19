// backend/src/controllers/EducationalGroupController.js
const educationalGroupService = require('../services/EducationalGroupService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class EducationalGroupController {
    constructor() {
        this.getAllEducationalGroups = catchErrorAsync(this.getAllEducationalGroups.bind(this));
        this.getEducationalGroupById = catchErrorAsync(this.getEducationalGroupById.bind(this));
        this.createEducationalGroup = catchErrorAsync(this.createEducationalGroup.bind(this));
        this.updateEducationalGroup = catchErrorAsync(this.updateEducationalGroup.bind(this));
        this.deleteEducationalGroup = catchErrorAsync(this.deleteEducationalGroup.bind(this));
    }

    async getAllEducationalGroups(req, res) {
        const groups = await educationalGroupService.getAllEducationalGroups();
        res.status(200).json({ success: true, data: groups });
    }

    async getEducationalGroupById(req, res) {
        const group = await educationalGroupService.getEducationalGroupById(req.params.id);
        res.status(200).json({ success: true, data: group });
    }

    async createEducationalGroup(req, res) {
        const newGroup = await educationalGroupService.createEducationalGroup(req.body);
        res.status(201).json({ success: true, data: newGroup });
    }

    async updateEducationalGroup(req, res) {
        const updatedGroup = await educationalGroupService.updateEducationalGroup(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedGroup });
    }

    async deleteEducationalGroup(req, res) {
        const message = await educationalGroupService.deleteEducationalGroup(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new EducationalGroupController();