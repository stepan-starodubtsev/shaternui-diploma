// backend/src/services/EducationalGroupService.js
const db = require('../models');
const AppError = require('../errors/AppError');

class EducationalGroupService {
    constructor() {
        this.EducationalGroup = db.EducationalGroup;
        this.Cadet = db.Cadet; // To include cadets in group fetch
        this.sequelize = require('../config/settingsDB');
    }

    async getAllEducationalGroups() {
        return await this.EducationalGroup.findAll({
            order: [
                ['id', 'ASC']
            ],
            include: [{model: this.Cadet, as: 'cadets'}]
        });
    }

    async getEducationalGroupById(id) {
        const group = await this.EducationalGroup.findByPk(id, {
            include: [{model: this.Cadet, as: 'cadets'}]
        });
        if (!group) {
            throw new AppError('Educational Group not found', 404);
        }
        return group;
    }

    async createEducationalGroup(groupData) {
        const {name, cadetIds = []} = groupData;
        if (!name) {
            throw new AppError('Group name is required', 400);
        }

        const t = await this.sequelize.transaction();
        try {
            const newGroup = await this.EducationalGroup.create({name}, {transaction: t});

            if (cadetIds.length > 0) {
                await this.Cadet.update(
                    {educationalGroupId: newGroup.id},
                    {where: {id: cadetIds}, transaction: t}
                );
            }

            await t.commit();
            return newGroup;
        } catch (error) {
            await t.rollback();
            throw new AppError(`Error creating group: ${error.message}`, 500);
        }
    }

    // --- НОВА ВЕРСІЯ МЕТОДУ UPDATE ---
    async updateEducationalGroup(id, updateData) {
        const {name, cadetIds} = updateData;

        const t = await this.sequelize.transaction();
        try {
            const group = await this.EducationalGroup.findByPk(id, {transaction: t});
            if (!group) {
                throw new AppError('Educational Group not found', 404);
            }

            // Оновлюємо назву групи, якщо вона є
            if (name) {
                await group.update({name}, {transaction: t});
            }

            // Якщо передано масив cadetIds, оновлюємо склад групи
            if (cadetIds !== undefined) {
                // 1. Відкріплюємо всіх поточних курсантів від цієї групи
                await this.Cadet.update(
                    {educationalGroupId: null},
                    {where: {educationalGroupId: id}, transaction: t}
                );

                // 2. Прикріплюємо новий список курсантів до групи
                if (cadetIds.length > 0) {
                    await this.Cadet.update(
                        {educationalGroupId: id},
                        {where: {id: cadetIds}, transaction: t}
                    );
                }
            }

            await t.commit();
            return await this.getEducationalGroupById(id); // Повертаємо оновлені дані з курсантами
        } catch (error) {
            await t.rollback();
            throw new AppError(`Error updating group: ${error.message}`, 500);
        }
    }

    async deleteEducationalGroup(id) {
        const t = await this.sequelize.transaction();
        try {
            const group = await this.EducationalGroup.findByPk(id, { transaction: t });
            if (!group) {
                throw new AppError('Educational Group not found', 404);
            }

            // 1. Відв'язуємо всіх курсантів від цієї групи
            await this.Cadet.update(
                { educationalGroupId: null },
                { where: { educationalGroupId: id }, transaction: t }
            );

            // 2. Видаляємо саму групу
            await group.destroy({ transaction: t });

            await t.commit();
            return { message: 'Educational Group and its associations deleted successfully' };
        } catch (error) {
            await t.rollback();
            throw new AppError(`Error deleting group: ${error.message}`, 500);
        }
    }
}

module.exports = new EducationalGroupService();