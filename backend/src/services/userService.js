const { User, TrainingSession } = require('../models');
const AppError = require("../errors/AppError");
const bcrypt = require("bcryptjs");
const sequelize = require('../config/settingsDB');

module.exports = {
    async createUser(userData) {
        const existingUserByEmail = await User.findOne({where: {email: userData.email}});
        if (existingUserByEmail) {
            throw new AppError(`User with email ${userData.email} already exists`, 400);
        }

        if (!userData.password_hash && userData.password) {
            userData.password_hash = await bcrypt.hash(userData.password, 10);
            delete userData.password;
        } else if (!userData.password_hash && !userData.password) {
            throw new AppError('Password is required to create a user', 400);
        }

        const user = await User.create(userData);
        const userToReturn = {...user.toJSON()};
        delete userToReturn.password_hash;
        return userToReturn;
    },

    async getAllUsers(filters = {}) {
        const users = await User.findAll({
            where: filters, /
            attributes: { exclude: ['password_hash'] },
            order: [
                ['user_id', 'ASC']
            ]
        });
        if (!users || users.length === 0) {
            return null;
        }
        return users;
    },

    async getUserById(id) {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        return user;
    },

    async getUserByEmail(email) {
        const user = await User.findOne({
            where: { email: email },
        });
        if (!user) {
            throw new AppError(`User with email ${email} not found`, 404);
        }
        return user;
    },

    async updateUser(id, updateData, options = {}) {
        const transaction = options.transaction;
        const user = await User.findByPk(id, { transaction });
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }

        if (updateData.password) {
            updateData.password_hash = await bcrypt.hash(updateData.password, 10);
            delete updateData.password;
        }

        await user.update(updateData, { transaction });
        const updatedUserToReturn = { ...user.toJSON() };
        delete updatedUserToReturn.password_hash;
        return updatedUserToReturn;
    },

    async deleteUser(id) {
        const trainingSessionService = require('./trainingSessionService');
        const transaction = await sequelize.transaction();
        try {
            const user = await User.findByPk(id, { transaction });
            if (!user) {
                await transaction.rollback();
                throw new AppError(`User with ID ${id} not found`, 404);
            }

            const sessions = await trainingSessionService.getAllTrainingSessions({ conducted_by_user_id: id });
            if (sessions && sessions.length > 0) {
                for (const session of sessions) {

                    await trainingSessionService.deleteTrainingSession(session.session_id, { transaction });

                }
            }
            const UnitModel = require('../models/Unit.model');
            await UnitModel.update({ commander_id: null }, { where: { commander_id: id }, transaction });


            await user.destroy({ transaction });
            await transaction.commit();
            return { message: `User with ID ${id} deleted successfully` };
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            console.error('Error in deleteUser service:', error);
            throw new AppError(`Could not delete User with ID ${id}: ${error.message}`, 500);
        }
    }
};