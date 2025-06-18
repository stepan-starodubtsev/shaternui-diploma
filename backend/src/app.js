const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Middleware
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const { ROLES } = require('./config/constants');

// Routers
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const unitRouter = require('./routes/unitRouter');
const militaryPersonnelRouter = require('./routes/militaryPersonnelRouter');
const exerciseRouter = require('./routes/exerciseRouter');
const locationRouter = require('./routes/locationRouter');
const trainingSessionRouter = require('./routes/trainingSessionRouter');
const sessionExerciseRouter = require('./routes/sessionExerciseRouter');
const standardAssessmentRouter = require('./routes/standardAssessmentRouter');

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'swagger.json'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Public Routes ---
app.use('/api/auth', authRouter);

// --- Protected Routes ---
app.use(authMiddleware);

// --- Role-Based Access ---

const usersPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: ['GET', 'PUT'] },
    [ROLES.COMMANDER]: { methods: ['GET', 'PUT'] },
    [ROLES.INSTRUCTOR]: { methods: ['GET', 'PUT'] }
};
app.use('/api/users', roleMiddleware(usersPermissions), userRouter);

const unitsPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: ['GET'] },
    [ROLES.COMMANDER]: { methods: ['GET'] },
    [ROLES.INSTRUCTOR]: { methods: ['GET'] }
};
app.use('/api/units', roleMiddleware(unitsPermissions), unitRouter);

const militaryPersonnelPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: ['GET'] },
    [ROLES.COMMANDER]: { methods: ['*'] },
    [ROLES.INSTRUCTOR]: { methods: ['GET'] }
};
app.use('/api/military-personnel', roleMiddleware(militaryPersonnelPermissions), militaryPersonnelRouter);

const exercisesPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: '*' },
    [ROLES.COMMANDER]: { methods: ['GET'] },
    [ROLES.INSTRUCTOR]: { methods: ['GET'] }
};
app.use('/api/exercises', roleMiddleware(exercisesPermissions), exerciseRouter);

const locationsPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: '*' },
    [ROLES.COMMANDER]: { methods: ['GET'] },
    [ROLES.INSTRUCTOR]: { methods: ['GET'] }
};
app.use('/api/locations', roleMiddleware(locationsPermissions), locationRouter);

const trainingSessionsPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: '*' },
    [ROLES.COMMANDER]: { methods: ['*'] },
    [ROLES.INSTRUCTOR]: { methods: ['GET', 'PUT'] }
};
app.use('/api/training-sessions', roleMiddleware(trainingSessionsPermissions), trainingSessionRouter);

const sessionExercisesPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: '*' },
    [ROLES.COMMANDER]: { methods: '*' },
    [ROLES.INSTRUCTOR]: { methods: '*' }
};
app.use('/api/session-exercises', roleMiddleware(sessionExercisesPermissions), sessionExerciseRouter);


const standardAssessmentsPermissions = {
    [ROLES.ADMIN]: { methods: '*' },
    [ROLES.DEPARTMENT_EMPLOYEE]: { methods: ['GET'] },
    [ROLES.COMMANDER]: { methods: '*' },
    [ROLES.INSTRUCTOR]: { methods: '*' }
};
app.use('/api/standard-assessments', roleMiddleware(standardAssessmentsPermissions), standardAssessmentRouter);


app.get('/api', (req, res) =>
    res.send('Physical Training Module API is running... (Authenticated)'));

app.use((error, req, res, next) => {
    console.error("Error Handler:", error.name, error.message, error.stack);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && {stack: error.stack})
    });
});

module.exports = app;