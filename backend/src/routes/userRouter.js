const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(UserController.getAll));
router.get('/:id', catchErrorsAsync(UserController.getById));
router.post('/', catchErrorsAsync(UserController.create));
router.put('/:id', catchErrorsAsync(UserController.update));
router.delete('/:id', catchErrorsAsync(UserController.delete));

module.exports = router;