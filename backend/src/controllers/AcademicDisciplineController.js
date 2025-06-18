// backend/src/controllers/AcademicDisciplineController.js
const academicDisciplineService = require('../services/AcademicDisciplineService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class AcademicDisciplineController {
    constructor() {
        this.getAllAcademicDisciplines = catchErrorAsync(this.getAllAcademicDisciplines.bind(this));
        this.getAcademicDisciplineById = catchErrorAsync(this.getAcademicDisciplineById.bind(this));
        this.createAcademicDiscipline = catchErrorAsync(this.createAcademicDiscipline.bind(this));
        this.updateAcademicDiscipline = catchErrorAsync(this.updateAcademicDiscipline.bind(this));
        this.deleteAcademicDiscipline = catchErrorAsync(this.deleteAcademicDiscipline.bind(this));
    }

    async getAllAcademicDisciplines(req, res) {
        const disciplines = await academicDisciplineService.getAllAcademicDisciplines();
        res.status(200).json({ success: true, data: disciplines });
    }

    async getAcademicDisciplineById(req, res) {
        const discipline = await academicDisciplineService.getAcademicDisciplineById(req.params.id);
        res.status(200).json({ success: true, data: discipline });
    }

    async createAcademicDiscipline(req, res) {
        const newDiscipline = await academicDisciplineService.createAcademicDiscipline(req.body);
        res.status(201).json({ success: true, data: newDiscipline });
    }

    async updateAcademicDiscipline(req, res) {
        const updatedDiscipline = await academicDisciplineService.updateAcademicDiscipline(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedDiscipline });
    }

    async deleteAcademicDiscipline(req, res) {
        const message = await academicDisciplineService.deleteAcademicDiscipline(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new AcademicDisciplineController();