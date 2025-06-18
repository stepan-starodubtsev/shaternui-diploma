
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: API for authentication
 */

router.post('/register', catchErrorsAsync(register));



router.post('/login', catchErrorsAsync(login));

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Get current authenticated user's data
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Current user's data
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserDto'
 * 401:
 * description: Unauthorized (token is missing or invalid)
 * 404:
 * description: User not found (e.g., user deleted after token was issued)
 * 500:
 * description: Server error
 */
router.get('/me', authMiddleware, catchErrorsAsync(getMe));

module.exports = router;