// backend/src/services/UserService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class UserService {
    constructor() {
        this.User = db.User;
        this.Instructor = db.Instructor;
    }

    async getAllUsers() {
        return await this.User.findAll({
            order: [
                ['id', 'ASC']
            ],
            include: [{
                model: this.Instructor,
                as: 'instructorProfile', // ВИПРАВЛЕНО
                attributes: ['id', 'fullName', 'rank', 'academicDegree', 'position']
            }]
        });
    }

    async getUserById(id) {
        const user = await this.User.findByPk(id, {
            include: [{
                model: this.Instructor,
                as: 'instructorProfile', // ВИПРАВЛЕНО
                attributes: ['id', 'fullName', 'rank', 'academicDegree', 'position']
            }]
        });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async updatePassword(userId, oldPassword, newPassword) {
        const user = await this.User.findByPk(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Перевіряємо, чи правильний поточний пароль
        if (!(await user.isValidPassword(oldPassword))) {
            throw new AppError('Incorrect current password', 401);
        }

        // Оновлюємо пароль і зберігаємо
        user.password = newPassword;
        await user.save(); // Хук beforeUpdate автоматично захешує новий пароль

        return { message: 'Password updated successfully' };
    }

    // ... решта методів залишаються без змін ...
    async createUser(userData) {
        const {username, password, email, role, instructorId} = userData;
        if (!username || !password || !role) {
            throw new AppError('Username, password, and role are required', 400);
        }
        if (role === 'INSTRUCTOR' && !instructorId) {
            throw new AppError('Instructor ID is required for INSTRUCTOR role', 400);
        }
        if (role === 'INSTRUCTOR') {
            const instructor = await this.Instructor.findByPk(instructorId);
            if (!instructor) {
                throw new AppError('Instructor not found', 404);
            }
            const existingUserForInstructor = await this.User.findOne({where: {instructorId: instructorId}});
            if (existingUserForInstructor) {
                throw new AppError('This instructor is already associated with an existing user account.', 400);
            }
        } else if (role !== 'ADMIN') {
            throw new AppError('Invalid user role specified', 400);
        }
        const newUser = await this.User.create(userData);
        return newUser;
    }

    async updateUser(id, updateData) {
        const user = await this.getUserById(id);
        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await this.User.findOne({where: {username: updateData.username}});
            if (existingUser && existingUser.id !== id) {
                throw new AppError('Username already taken', 400);
            }
        }
        if (updateData.password) {
            const salt = await require('bcryptjs').genSalt(10);
            updateData.password = await require('bcryptjs').hash(updateData.password, salt);
        }
        if (updateData.instructorId !== undefined) {
            if (updateData.role === 'INSTRUCTOR') {
                if (updateData.instructorId === null || updateData.instructorId === '') {
                    throw new AppError('Instructor ID cannot be null for INSTRUCTOR role', 400);
                }
                const instructor = await this.Instructor.findByPk(updateData.instructorId);
                if (!instructor) {
                    throw new AppError('Instructor not found', 404);
                }
                const existingUserForInstructor = await this.User.findOne({where: {instructorId: updateData.instructorId}});
                if (existingUserForInstructor && existingUserForInstructor.id !== id) {
                    throw new AppError('This instructor is already associated with another user account.', 400);
                }
            } else if (updateData.role === 'ADMIN' || user.role === 'ADMIN') {
                if (updateData.instructorId !== null) {
                    const instructor = await this.Instructor.findByPk(updateData.instructorId);
                    if (!instructor) {
                        throw new AppError('Instructor not found', 404);
                    }
                    const existingUserForInstructor = await this.User.findOne({where: {instructorId: updateData.instructorId}});
                    if (existingUserForInstructor && existingUserForInstructor.id !== id) {
                        throw new AppError('This instructor is already associated with another user account.', 400);
                    }
                }
            } else {
                if (updateData.instructorId === null) {
                    throw new AppError('Instructor ID cannot be null for INSTRUCTOR role', 400);
                }
            }
        }
        if (updateData.role && !['ADMIN', 'INSTRUCTOR'].includes(updateData.role)) {
            throw new AppError('Invalid user role specified', 400);
        }
        await user.update(updateData);
        return user;
    }

    async deleteUser(id) {
        const user = await this.getUserById(id);
        await user.destroy();
        return {message: 'User deleted successfully'};
    }
}

module.exports = new UserService();