const express = require('express');
const router = express.Router();
const UnitController = require('../controllers/unitController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(UnitController.getAll));
router.get('/:id', catchErrorsAsync(UnitController.getById));
router.post('/', catchErrorsAsync(UnitController.create));
router.put('/:id', catchErrorsAsync(UnitController.update));
router.delete('/:id', catchErrorsAsync(UnitController.delete));

module.exports = router;