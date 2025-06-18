// backend/src/routes/instructorRouter.js
const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/InstructorController');

// Define routes for Instructor
router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructorById);
router.post('/', instructorController.createInstructor);
router.put('/:id', instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);

module.exports = router;