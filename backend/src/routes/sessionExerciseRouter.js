const express = require('express');
const router = express.Router();
const SessionExerciseController = require('../controllers/sessionExerciseController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');


router.get('/:id', catchErrorsAsync(SessionExerciseController.getBySessionId));
router.post('/', catchErrorsAsync(SessionExerciseController.addExerciseToSession));
router.put('/:id', catchErrorsAsync(SessionExerciseController.updateExerciseInSession));
router.delete('/:id', catchErrorsAsync(SessionExerciseController.removeExerciseFromSessionById));

module.exports = router;