const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(LocationController.getAll));
router.get('/:id', catchErrorsAsync(LocationController.getById));
router.post('/', catchErrorsAsync(LocationController.create));
router.put('/:id', catchErrorsAsync(LocationController.update));
router.delete('/:id', catchErrorsAsync(LocationController.delete));

module.exports = router;