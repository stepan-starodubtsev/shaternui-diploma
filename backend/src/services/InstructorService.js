// backend/src/services/InstructorService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class InstructorService {
    constructor() {
        this.Instructor = db.Instructor;
        this.User = db.User; // To handle user association
    }

    async getAllInstructors() {
        return await this.Instructor.findAll({
            order: [
                ['id', 'ASC']
            ]
        });
    }

    async getInstructorById(id) {
        const instructor = await this.Instructor.findByPk(id);
        if (!instructor) {
            throw new AppError('Instructor not found', 404);
        }
        return instructor;
    }

    async createInstructor(instructorData) {
        // Basic validation, more can be added later
        if (!instructorData.fullName || !instructorData.position) {
            throw new AppError('Full name and position are required for Instructor', 400);
        }
        const newInstructor = await this.Instructor.create(instructorData);
        return newInstructor;
    }

    async updateInstructor(id, updateData) {
        const instructor = await this.getInstructorById(id);
        await instructor.update(updateData);
        return instructor;
    }

    async deleteInstructor(id) {
        const instructor = await this.getInstructorById(id);
        // Disassociate users from this instructor before deleting the instructor
        await this.User.update(
            { instructorId: null },
            { where: { instructorId: id } }
        );
        await instructor.destroy();
        return { message: 'Instructor deleted successfully' };
    }
}

module.exports = new InstructorService();