const express = require('express');
const router = express.Router();
const TrainingSessionController = require('../controllers/trainingSessionController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(TrainingSessionController.getAll));
router.get('/:id', catchErrorsAsync(TrainingSessionController.getById));
router.post('/', catchErrorsAsync(TrainingSessionController.create));
router.put('/:id', catchErrorsAsync(TrainingSessionController.update));
router.delete('/:id', catchErrorsAsync(TrainingSessionController.delete));

module.exports = router;