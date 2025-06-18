const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/exerciseController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');


router.get('/', catchErrorsAsync(ExerciseController.getAll));
router.get('/:id', catchErrorsAsync(ExerciseController.getById));
router.post('/', catchErrorsAsync(ExerciseController.create));
router.put('/:id', catchErrorsAsync(ExerciseController.update));
router.delete('/:id', catchErrorsAsync(ExerciseController.delete));

module.exports = router;