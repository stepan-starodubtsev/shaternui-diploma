// backend/src/services/AcademicDisciplineService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class AcademicDisciplineService {
    constructor() {
        this.AcademicDiscipline = db.AcademicDiscipline;
    }

    async getAllAcademicDisciplines() {
        return await this.AcademicDiscipline.findAll({
            order: [
                ['id', 'ASC']
            ]
        });
    }

    async getAcademicDisciplineById(id) {
        const discipline = await this.AcademicDiscipline.findByPk(id);
        if (!discipline) {
            throw new AppError('Academic Discipline not found', 404);
        }
        return discipline;
    }

    async createAcademicDiscipline(disciplineData) {
        if (!disciplineData.name) {
            throw new AppError('Discipline name is required', 400);
        }
        const newDiscipline = await this.AcademicDiscipline.create(disciplineData);
        return newDiscipline;
    }

    async updateAcademicDiscipline(id, updateData) {
        const discipline = await this.getAcademicDisciplineById(id);
        await discipline.update(updateData);
        return discipline;
    }

    async deleteAcademicDiscipline(id) {
        const discipline = await this.getAcademicDisciplineById(id);
        // Consider adding a check if any lessons are associated with this discipline
        // If you need to prevent deletion if lessons exist:
        // const associatedLessons = await db.Lesson.count({ where: { academicDisciplineId: id } });
        // if (associatedLessons > 0) {
        //   throw new AppError('Cannot delete discipline with associated lessons.', 400);
        // }
        await discipline.destroy();
        return { message: 'Academic Discipline deleted successfully' };
    }
}

module.exports = new AcademicDisciplineService();