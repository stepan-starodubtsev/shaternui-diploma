// backend/src/routes/userRouter.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const authMiddleware = require('../middleware/authMiddleware'); // Uncomment when adding auth
// const roleMiddleware = require('../middleware/roleMiddleware'); // Uncomment when adding auth

// No auth/role middleware for now, will add later
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;