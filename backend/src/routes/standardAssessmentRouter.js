const express = require('express');
const router = express.Router();
const StandardAssessmentController = require('../controllers/standardAssessmentController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(StandardAssessmentController.getAll));
router.get('/:id', catchErrorsAsync(StandardAssessmentController.getById));
router.post('/', catchErrorsAsync(StandardAssessmentController.create));
router.put('/:id', catchErrorsAsync(StandardAssessmentController.update));
router.delete('/:id', catchErrorsAsync(StandardAssessmentController.delete));

module.exports = router;