// backend/src/routes/educationalGroupRouter.js
const express = require('express');
const router = express.Router();
const educationalGroupController = require('../controllers/EducationalGroupController');

// Define routes for EducationalGroup
router.get('/', educationalGroupController.getAllEducationalGroups);
router.get('/:id', educationalGroupController.getEducationalGroupById);
router.post('/', educationalGroupController.createEducationalGroup);
router.put('/:id', educationalGroupController.updateEducationalGroup);
router.delete('/:id', educationalGroupController.deleteEducationalGroup);

module.exports = router;