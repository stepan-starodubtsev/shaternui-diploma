// backend/src/routes/cadetRouter.js
const express = require('express');
const router = express.Router();
const cadetController = require('../controllers/CadetController');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.use(authMiddleware, roleMiddleware(['ADMIN']));

// Define routes for Cadet
router.get('/', cadetController.getAllCadets);
router.get('/:id', cadetController.getCadetById);
router.post('/', cadetController.createCadet);
router.put('/:id', cadetController.updateCadet);
router.delete('/:id', cadetController.deleteCadet);

module.exports = router;