// backend/src/controllers/userController.js
const userService = require('../services/userService');
const catchErrorAsync = require('../middleware/catchErrorAsync');

class UserController {
    constructor() {
        this.getAllUsers = catchErrorAsync(this.getAllUsers.bind(this));
        this.getUserById = catchErrorAsync(this.getUserById.bind(this));
        this.createUser = catchErrorAsync(this.createUser.bind(this));
        this.updateUser = catchErrorAsync(this.updateUser.bind(this));
        this.deleteUser = catchErrorAsync(this.deleteUser.bind(this));
    }

    async getAllUsers(req, res) {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }

    async getUserById(req, res) {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    }

    async createUser(req, res) {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({ success: true, data: newUser });
    }

    async updateUser(req, res) {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedUser });
    }

    async deleteUser(req, res) {
        const message = await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message });
    }
}

module.exports = new UserController();