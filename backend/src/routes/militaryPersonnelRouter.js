const express = require('express');
const router = express.Router();
const MilitaryPersonnelController = require('../controllers/militaryPersonnelController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(MilitaryPersonnelController.getAll));
router.get('/:id', catchErrorsAsync(MilitaryPersonnelController.getById));
router.post('/', catchErrorsAsync(MilitaryPersonnelController.create));
router.put('/:id', catchErrorsAsync(MilitaryPersonnelController.update));
router.delete('/:id', catchErrorsAsync(MilitaryPersonnelController.delete));

module.exports = router;