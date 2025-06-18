// backend/src/controllers/InstructorController.js
const instructorService = require('../services/InstructorService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class InstructorController {
    constructor() {
        // Bind methods to the instance to ensure `this` context is correct
        this.getAllInstructors = catchErrorAsync(this.getAllInstructors.bind(this));
        this.getInstructorById = catchErrorAsync(this.getInstructorById.bind(this));
        this.createInstructor = catchErrorAsync(this.createInstructor.bind(this));
        this.updateInstructor = catchErrorAsync(this.updateInstructor.bind(this));
        this.deleteInstructor = catchErrorAsync(this.deleteInstructor.bind(this));
    }

    async getAllInstructors(req, res) {
        const instructors = await instructorService.getAllInstructors();
        res.status(200).json({ success: true, data: instructors });
    }

    async getInstructorById(req, res) {
        const instructor = await instructorService.getInstructorById(req.params.id);
        res.status(200).json({ success: true, data: instructor });
    }

    async createInstructor(req, res) {
        const newInstructor = await instructorService.createInstructor(req.body);
        res.status(201).json({ success: true, data: newInstructor });
    }

    async updateInstructor(req, res) {
        const updatedInstructor = await instructorService.updateInstructor(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedInstructor });
    }

    async deleteInstructor(req, res) {
        const message = await instructorService.deleteInstructor(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new InstructorController();