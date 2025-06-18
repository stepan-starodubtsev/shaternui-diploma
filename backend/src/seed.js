const sequelize = require('./config/settingsDB');
const bcrypt = require('bcryptjs');

const User = require('./models/user.model');
const Unit = require('./models/unit.model');
const MilitaryPersonnel = require('./models/militaryPersonnel.model');
const Exercise = require('./models/exercise.model');
const Location = require('./models/location.model');
const TrainingSession = require('./models/trainingSession.model');
const SessionExercise = require('./models/sessionExercise.model');
const StandardAssessment = require('./models/standardAssessment.model');

const firstNames = ['Іван', 'Петро', 'Олександр', 'Дмитро', 'Володимир', 'Андрій',
    'Сергій', 'Михайло', 'Віктор', 'Юрій', 'Олег', 'Тарас', 'Богдан', 'Максим', 'Артем', 'Денис', 'Євген', 'Назар'];
const lastNames = ['Петренко', 'Іванов', 'Сидоренко', 'Коваленко',
    'Шевченко', 'Мельник', 'Ткаченко', 'Бондаренко', 'Поліщук', 'Кравченко',
    'Савченко', 'Бойко', 'Шевчук', 'Лисенко', 'Павленко', 'Григоренко', 'Романенко', 'Сергієнко'];
const patronymics = ['Іванович', 'Петрович', 'Олександрович', 'Дмитрович',
    'Володимирович', 'Андрійович', 'Сергійович', 'Михайлович', 'Вікторович', 'Юрійович',
    'Олегович', 'Тарасович', 'Богданович', 'Максимович', 'Артемович', 'Денисович', 'Євгенович', 'Назарович'];
const ranks = ['курсант', 'солдат', 'сержант', 'старшина', 'лейтенант', 'старший лейтенант', 'капітан'];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateRandomDate =
    (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateUkrainianFullName = () => `${randomChoice(lastNames)} 
${randomChoice(firstNames)} ${randomChoice(patronymics)}`;
const generateUkrainianShortName = () => `${randomChoice(lastNames)}
 ${randomChoice(firstNames).charAt(0)}. ${randomChoice(patronymics).charAt(0)}.`;


const seedDatabase = async () => {
    try {
        console.log('Synchronizing database schema...');
        await sequelize.sync({force: true});
        console.log('Database schema synchronized.');

        console.log('Starting database seeding for sports module...');

        console.log('Creating units...');
        const unitsData = [
            {unit_name: '1-й навчальний батальйон'},
            {unit_name: '2-й навчальний батальйон'},
            {unit_name: 'Факультет №1, 1-й курс'},
            {unit_name: 'Факультет №1, 2-й курс'},
            {unit_name: 'Факультет №2, 1-й курс, 101 група'},
            {unit_name: 'Факультет №2, 1-й курс, 102 група'},
        ];
        const units = await Unit.bulkCreate(unitsData, {returning: true});
        console.log(`${units.length} units created.`);

        console.log('Creating users...');
        const passwordHash = await bcrypt.hash('password123', 10);
        const usersData = [
            {
                first_name: 'Адміністратор',
                last_name: 'Системи',
                email: 'admin@sport.local',
                password_hash: passwordHash,
                role: 'ADMIN',
                unit_id: null
            },
            {
                first_name: 'Іван',
                last_name: 'Викладаченко',
                email: 'instructor1@sport.local',
                password_hash: passwordHash,
                role: 'INSTRUCTOR',
                unit_id: null
            },
            {
                first_name: 'Петро',
                last_name: 'Інструкторенко',
                email: 'instructor2@sport.local',
                password_hash: passwordHash,
                role: 'INSTRUCTOR',
                unit_id: null
            },
            {
                first_name: 'Сергій',
                last_name: 'Відділенко',
                email: 'department@sport.local',
                password_hash: passwordHash,
                role: 'DEPARTMENT_EMPLOYEE',
                unit_id: null
            },
        ];

        for (let i = 0; i < units.length; i++) {
            usersData.push({
                first_name: randomChoice(firstNames),
                last_name: randomChoice(lastNames),
                email: `commander_unit${i + 1}@sport.local`,
                password_hash: passwordHash,
                role: 'COMMANDER',
                unit_id: units[i].unit_id
            });
        }

        const users = await User.bulkCreate(usersData, {returning: true});
        console.log(`${users.length} users created.`);

        console.log('Creating military personnel...');
        const militaryPersonnelData = [];
        for (let i = 0; i < 50; i++) {
            militaryPersonnelData.push({
                first_name: randomChoice(firstNames),
                last_name: randomChoice(lastNames),
                rank: randomChoice(ranks),
                date_of_birth: generateRandomDate(
                    new Date(1995, 0, 1), new Date(2005, 11, 31)),
                unit_id: randomChoice(units).unit_id,
            });
        }
        const militaryPersonnel =
            await MilitaryPersonnel.bulkCreate(militaryPersonnelData, {returning: true});
        console.log(`${militaryPersonnel.length} military personnel created.`);

        console.log('Creating locations...');
        const locationsData = [
            {name: 'Спортивний зал №1', description: 'Основний спортивний зал'},
            {name: 'Стадіон', description: 'Футбольне поле та бігові доріжки'},
            {name: 'Смуга перешкод А', description: 'Смуга перешкод біля корпусу №3'},
            {name: 'Спортивний майданчик №1 (гімнастичний)', description: 'Турніки, бруси'},
            {name: 'Басейн (25м)', description: 'Плавання'},
        ];
        const locations = await Location.bulkCreate(locationsData, {returning: true});
        console.log(`${locations.length} locations created.`);

        console.log('Creating exercises...');
        const exercisesData = [
            {exercise_name: 'Підтягування на перекладині', description: 'Кількість разів'},
            {exercise_name: 'Біг 100м', description: 'Час у секундах'},
            {exercise_name: 'Біг 3000м', description: 'Час у хвилинах та секундах'},
            {exercise_name: 'Комплексна силова вправа (КСВ)', description: 'Кількість циклів за 1 хв'},
            {exercise_name: 'Плавання 100м вільним стилем', description: 'Час'},
            {exercise_name: 'Подолання смуги перешкод', description: 'Час'},
            {exercise_name: 'Згинання та розгинання рук в упорі лежачи', description: 'Кількість разів'},
            {exercise_name: 'Стрибок у довжину з місця', description: 'См'},
        ];
        const exercises = await Exercise.bulkCreate(exercisesData, {returning: true});
        console.log(`${exercises.length} exercises created.`);

        console.log('Creating training sessions and session exercises...');
        const trainingSessions = [];
        const sessionTypes = ['TRAINING', 'STANDARDS_ASSESSMENT', 'UNIT_TRAINING'];
        const instructorUsers = users.filter(u => u.role === 'INSTRUCTOR' ||
            u.role === 'COMMANDER');

        for (let i = 0; i < 15; i++) {
            const sessionType = randomChoice(sessionTypes);
            const startDate = generateRandomDate(
                new Date(2025, 5, 1),
                new Date(2025, 5, 30));
            const startHour = randomInt(8, 16);
            startDate.setHours(startHour, 0, 0, 0);
            const endDate = new Date(startDate.getTime() + randomInt(1, 2) * 60 * 60 * 1000);

            const conductedByUser = randomChoice(instructorUsers);
            const unitForSession = (sessionType === 'TRAINING' || sessionType === 'STANDARDS_ASSESSMENT')
                ? randomChoice(units)
                : (conductedByUser.role === 'COMMANDER'
                    ? units.find(u => u.unit_id === conductedByUser.unit_id) ||
                    randomChoice(units) : randomChoice(units));


            const session = await TrainingSession.create({
                session_type: sessionType,
                start_datetime: startDate,
                end_datetime: endDate,
                location_id: randomChoice(locations).location_id,
                conducted_by_user_id: conductedByUser.user_id,
                unit_id: unitForSession.unit_id,
            }, {returning: true});
            trainingSessions.push(session);

            const numExercisesInSession = randomInt(2, 5);
            const availableExercises = [...exercises];
            for (let j = 0; j < numExercisesInSession && availableExercises.length > 0; j++) {
                const randomExerciseIndex = randomInt(0, availableExercises.length - 1);
                const selectedExercise = availableExercises.splice(randomExerciseIndex, 1)[0];
                await SessionExercise.create({
                    session_id: session.session_id,
                    exercise_id: selectedExercise.exercise_id,
                    order_in_session: j + 1,
                });
            }
        }
        console.log(`${trainingSessions.length} training sessions with exercises created.`);

        console.log('Creating standard assessments...');
        const assessmentSessions = trainingSessions.filter(s => s.session_type === 'STANDARDS_ASSESSMENT');

        const scoreEnumValues = [
            'PASSED',
            'EXCELLENT',
            'GOOD',
            'SATISFACTORY',
            'FAILED'
        ];

        for (const session of assessmentSessions) {
            const personnelInUnit =
                militaryPersonnel.filter(p => p.unit_id === session.unit_id);
            if (personnelInUnit.length === 0) continue;

            const sessionExercises =
                await SessionExercise.findAll({where: {session_id: session.session_id}});
            if (sessionExercises.length === 0) continue;

            for (let k = 0; k < Math.min(personnelInUnit.length, randomInt(5, 15)); k++) {
                const personToAssess = randomChoice(personnelInUnit);
                for (const se of sessionExercises) {
                    if (Math.random() > 0.3) {
                        await StandardAssessment.create({
                            session_id: session.session_id,
                            military_person_id: personToAssess.military_person_id,
                            exercise_id: se.exercise_id,
                            score: randomChoice(scoreEnumValues),
                            assessment_datetime: session.start_datetime,
                            notes: Math.random() > 0.7 ? 'Виконано з зауваженнями' : null,
                        });
                    }
                }
            }
        }
        console.log('Standard assessments created.');

        console.log('Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

seedDatabase();