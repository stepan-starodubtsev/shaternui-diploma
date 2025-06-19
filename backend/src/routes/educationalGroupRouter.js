const express = require('express');
const router = express.Router();
const educationalGroupController = require('../controllers/EducationalGroupController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Всі маршрути для груп захищені і доступні тільки адміну
router.use(authMiddleware, roleMiddleware(['ADMIN']));

router.get('/', educationalGroupController.getAllEducationalGroups);
router.post('/', educationalGroupController.createEducationalGroup);
router.get('/:id', educationalGroupController.getEducationalGroupById);
router.put('/:id', educationalGroupController.updateEducationalGroup);
router.delete('/:id', educationalGroupController.deleteEducationalGroup);

module.exports = router;