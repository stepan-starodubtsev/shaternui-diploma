const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);

// Цей маршрут захищений: спочатку authMiddleware перевірить токен,
// а потім getMe поверне дані користувача
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;