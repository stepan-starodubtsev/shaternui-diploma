const userService = require('../services/userService');
const AppError = require('../errors/AppError');

module.exports = {
    async getAll(req, res) {
        const users = await userService.getAllUsers();
        if (!users) {
            return res.json([]);
        }
        res.json(users);
    },

    async getById(req, res) {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    },

    async create(req, res) {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    },

    async update(req, res) {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    },

    async delete(req, res) {
        const result = await userService.deleteUser(req.params.id);
        res.status(204).json(result);
    }
};