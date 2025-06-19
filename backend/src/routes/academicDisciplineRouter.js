// backend/src/routes/academicDisciplineRouter.js
const express = require('express');
const router = express.Router();
const academicDisciplineController = require('../controllers/AcademicDisciplineController');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.use(authMiddleware, roleMiddleware(['ADMIN', 'INSTRUCTOR']));

// Define routes for AcademicDiscipline
router.get('/', academicDisciplineController.getAllAcademicDisciplines);
router.get('/:id', academicDisciplineController.getAcademicDisciplineById);
router.post('/', academicDisciplineController.createAcademicDiscipline);
router.put('/:id', academicDisciplineController.updateAcademicDiscipline);
router.delete('/:id', academicDisciplineController.deleteAcademicDiscipline);

module.exports = router;