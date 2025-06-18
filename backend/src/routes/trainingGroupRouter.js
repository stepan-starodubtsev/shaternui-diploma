// backend/src/routes/trainingGroupRouter.js
const express = require('express');
const router = express.Router();
const trainingGroupController = require('../controllers/TrainingGroupController');

// Define routes for TrainingGroup
router.get('/', trainingGroupController.getAllTrainingGroups);
router.get('/:id', trainingGroupController.getTrainingGroupById);
router.post('/', trainingGroupController.createTrainingGroup);
router.put('/:id', trainingGroupController.updateTrainingGroup);
router.delete('/:id', trainingGroupController.deleteTrainingGroup);

module.exports = router;