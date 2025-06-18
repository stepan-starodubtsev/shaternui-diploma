// backend/src/controllers/CadetController.js
const cadetService = require('../services/CadetService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class CadetController {
    constructor() {
        this.getAllCadets = catchErrorAsync(this.getAllCadets.bind(this));
        this.getCadetById = catchErrorAsync(this.getCadetById.bind(this));
        this.createCadet = catchErrorAsync(this.createCadet.bind(this));
        this.updateCadet = catchErrorAsync(this.updateCadet.bind(this));
        this.deleteCadet = catchErrorAsync(this.deleteCadet.bind(this));
    }

    async getAllCadets(req, res) {
        const cadets = await cadetService.getAllCadets();
        res.status(200).json({ success: true, data: cadets });
    }

    async getCadetById(req, res) {
        const cadet = await cadetService.getCadetById(req.params.id);
        res.status(200).json({ success: true, data: cadet });
    }

    async createCadet(req, res) {
        const newCadet = await cadetService.createCadet(req.body);
        res.status(201).json({ success: true, data: newCadet });
    }

    async updateCadet(req, res) {
        const updatedCadet = await cadetService.updateCadet(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedCadet });
    }

    async deleteCadet(req, res) {
        const message = await cadetService.deleteCadet(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new CadetController();