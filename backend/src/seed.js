// backend/src/seed.js
const db = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        // Sync all models - this will drop and recreate tables if force: true
        await db.sequelize.sync({ force: true });
        console.log('Database synced. All tables dropped and recreated!');

        // 1. Create ADMIN User
        const adminUser = await db.User.create({
            username: 'admin',
            password: 'password123', // This will be hashed by the model hook
            email: 'admin@example.com',
            role: 'ADMIN',
        });
        console.log('Admin user created:', adminUser.username);

        // 2. Create Instructors
        const instructor1 = await db.Instructor.create({
            fullName: 'Сергій Іванович Коваленко',
            rank: 'полковник',
            academicDegree: 'доктор філософії',
            position: 'Начальник кафедри',
        });
        const instructor2 = await db.Instructor.create({
            fullName: 'Олена Петрівна Морозова',
            rank: null, // Civilian instructor
            academicDegree: 'кандидат наук',
            position: 'Викладач кафедри',
        });
        console.log('Instructors created:', instructor1.fullName, instructor2.fullName);

        // Link Instructor accounts to Users
        const instructorUser1 = await db.User.create({
            username: 'kovalenko',
            password: 'password123',
            email: 'kovalenko@example.com',
            role: 'INSTRUCTOR',
            instructorId: instructor1.id,
        });
        const instructorUser2 = await db.User.create({
            username: 'morozova',
            password: 'password123',
            email: 'morozova@example.com',
            role: 'INSTRUCTOR',
            instructorId: instructor2.id,
        });
        console.log('Instructor users created:', instructorUser1.username, instructorUser2.username);

        // 3. Create Academic Disciplines
        const discipline1 = await db.AcademicDiscipline.create({
            name: 'Тактична підготовка',
            description: 'Вивчення основ тактики та бойового застосування підрозділів.',
        });
        const discipline2 = await db.AcademicDiscipline.create({
            name: 'Вогнева підготовка',
            description: 'Навчання навичкам володіння стрілецькою зброєю та ведення вогню.',
        });
        const discipline3 = await db.AcademicDiscipline.create({
            name: 'Військова топографія',
            description: 'Вивчення топографічних карт, орієнтування на місцевості.',
        });
        console.log('Academic Disciplines created:', discipline1.name, discipline2.name, discipline3.name);

        // 4. Create Training Groups
        const group1 = await db.TrainingGroup.create({ name: 'Група 101' });
        const group2 = await db.TrainingGroup.create({ name: 'Група 102' });
        const group3 = await db.TrainingGroup.create({ name: 'Група 103' });
        console.log('Training Groups created:', group1.name, group2.name, group3.name);

        // 5. Create Cadets for each group (10 cadets per group)
        const cadets = [];
        for (let i = 1; i <= 10; i++) {
            cadets.push(await db.Cadet.create({
                fullName: `Іванов Іван ${i}`,
                rank: 'солдат',
                position: 'Курсант',
                trainingGroupId: group1.id,
            }));
        }
        for (let i = 1; i <= 10; i++) {
            cadets.push(await db.Cadet.create({
                fullName: `Петров Петро ${i}`,
                rank: 'солдат',
                position: 'Курсант',
                trainingGroupId: group2.id,
            }));
        }
        for (let i = 1; i <= 10; i++) {
            cadets.push(await db.Cadet.create({
                fullName: `Сидоров Сидір ${i}`,
                rank: 'солдат',
                position: 'Курсант',
                trainingGroupId: group3.id,
            }));
        }
        console.log(`Created ${cadets.length} cadets.`);

        // Helper to get cadets by group ID
        const getCadetsByGroupId = async (groupId) => {
            return await db.Cadet.findAll({ where: { trainingGroupId: groupId } });
        };

        // 6. Create Lessons
        const lessons = [];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Ensure at least one lesson on 20.06.2025 starting at 09:00
        const fixedDate = new Date(Date.UTC(2025, 5, 20, 9, 0, 0)); // June is month 5 (0-indexed)
        if (fixedDate.getMonth() !== currentMonth || fixedDate.getFullYear() !== currentYear) {
            console.warn('Current month is not June 2025. Seeding fixed date will be outside current month logic.');
            // Adjust fixedDate to be in current month if current month is not June 2025
            fixedDate.setMonth(currentMonth);
            fixedDate.setFullYear(currentYear);
            fixedDate.setDate(fixedDate.getDate() < 20 ? fixedDate.getDate() + 5 : fixedDate.getDate() - 5); // Adjust day to be valid and not too far
        }


        // Instructor 1 lessons (2 lessons per discipline)
        lessons.push(await db.Lesson.create({
            name: 'Введення в тактику бою',
            academicDisciplineId: discipline1.id,
            instructorId: instructor1.id,
            trainingGroupId: group1.id,
            location: 'Аудиторія 101',
            startTime: new Date(currentYear, currentMonth, 15, 10, 0),
            endTime: new Date(currentYear, currentMonth, 15, 11, 30),
        }));
        lessons.push(await db.Lesson.create({
            name: 'Основи ведення бою',
            academicDisciplineId: discipline1.id,
            instructorId: instructor1.id,
            trainingGroupId: group2.id,
            location: 'Поле №1',
            startTime: new Date(currentYear, currentMonth, 16, 13, 0),
            endTime: new Date(currentYear, currentMonth, 16, 14, 30),
        }));

        lessons.push(await db.Lesson.create({
            name: 'Техніка стрільби з автомата',
            academicDisciplineId: discipline2.id,
            instructorId: instructor1.id,
            trainingGroupId: group1.id,
            location: 'Тир №1',
            startTime: new Date(currentYear, currentMonth, 17, 9, 0),
            endTime: new Date(currentYear, currentMonth, 17, 10, 30),
        }));
        lessons.push(await db.Lesson.create({
            name: 'Правила безпеки при поводженні зі зброєю',
            academicDisciplineId: discipline2.id,
            instructorId: instructor1.id,
            trainingGroupId: group3.id,
            location: 'Аудиторія 102',
            startTime: new Date(currentYear, currentMonth, 18, 11, 0),
            endTime: new Date(currentYear, currentMonth, 18, 12, 30),
        }));

        lessons.push(await db.Lesson.create({
            name: 'Читання топографічних карт',
            academicDisciplineId: discipline3.id,
            instructorId: instructor1.id,
            trainingGroupId: group1.id,
            location: 'Аудиторія 103',
            startTime: new Date(currentYear, currentMonth, 19, 14, 0),
            endTime: new Date(currentYear, currentMonth, 19, 15, 30),
        }));
        lessons.push(await db.Lesson.create({
            name: 'Орієнтування на місцевості',
            academicDisciplineId: discipline3.id,
            instructorId: instructor1.id,
            trainingGroupId: group2.id,
            location: 'Лісосмуга',
            startTime: new Date(currentYear, currentMonth, 20, 9, 0), // Specific lesson: 20.06.2025 09:00
            endTime: new Date(currentYear, currentMonth, 20, 10, 30),
        }));


        // Instructor 2 lessons (2 lessons per discipline)
        lessons.push(await db.Lesson.create({
            name: 'Бойове злагодження',
            academicDisciplineId: discipline1.id,
            instructorId: instructor2.id,
            trainingGroupId: group3.id,
            location: 'Тренувальний комплекс',
            startTime: new Date(currentYear, currentMonth, 15, 13, 0),
            endTime: new Date(currentYear, currentMonth, 15, 14, 30),
        }));
        lessons.push(await db.Lesson.create({
            name: 'Аналіз тактичних ситуацій',
            academicDisciplineId: discipline1.id,
            instructorId: instructor2.id,
            trainingGroupId: group1.id,
            location: 'Аудиторія 201',
            startTime: new Date(currentYear, currentMonth, 16, 9, 0),
            endTime: new Date(currentYear, currentMonth, 16, 10, 30),
        }));

        lessons.push(await db.Lesson.create({
            name: 'Спеціальна вогнева підготовка',
            academicDisciplineId: discipline2.id,
            instructorId: instructor2.id,
            trainingGroupId: group2.id,
            location: 'Тир №2',
            startTime: new Date(currentYear, currentMonth, 17, 14, 0),
            endTime: new Date(currentYear, currentMonth, 17, 15, 30),
        }));
        lessons.push(await db.Lesson.create({
            name: 'Нічна стрільба',
            academicDisciplineId: discipline2.id,
            instructorId: instructor2.id,
            trainingGroupId: group3.id,
            location: 'Полігон',
            startTime: new Date(currentYear, currentMonth, 18, 18, 0),
            endTime: new Date(currentYear, currentMonth, 18, 19, 30),
        }));

        lessons.push(await db.Lesson.create({
            name: 'Використання сучасних навігаційних систем',
            academicDisciplineId: discipline3.id,
            instructorId: instructor2.id,
            trainingGroupId: group3.id,
            location: 'Лабораторія ГІС',
            startTime: new Date(currentYear, currentMonth, 19, 9, 0),
            endTime: new Date(currentYear, currentMonth, 19, 10, 30),
        }));
        lessons.push(await db.Lesson.create({
            name: 'Робота з аерознімками',
            academicDisciplineId: discipline3.id,
            instructorId: instructor2.id,
            trainingGroupId: group1.id,
            location: 'Аудиторія 202',
            startTime: new Date(currentYear, currentMonth, 20, 11, 0), // Another lesson on 20.06.2025
            endTime: new Date(currentYear, currentMonth, 20, 12, 30),
        }));
        console.log(`Created ${lessons.length} lessons.`);

        // 7. Create Attendance records for past lessons
        const attendanceStatuses = ['Прибув', 'Хворий', 'Наряд', 'Відрядження', 'Відпустка'];
        const now = new Date();

        for (const lesson of lessons) {
            // Check if the lesson has already ended
            if (lesson.endTime < now) {
                const cadetsInGroup = await getCadetsByGroupId(lesson.trainingGroupId);
                const attendanceRecords = cadetsInGroup.map(cadet => {
                    const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
                    return {
                        lessonId: lesson.id,
                        cadetId: cadet.id,
                        status: status,
                    };
                });
                if (attendanceRecords.length > 0) {
                    await db.Attendance.bulkCreate(attendanceRecords);
                    console.log(`Created attendance records for past lesson: "${lesson.name}"`);
                }
            }
        }

        console.log('Seed data successfully inserted!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        await db.sequelize.close();
        console.log('Database connection closed.');
    }
};

seedDatabase();