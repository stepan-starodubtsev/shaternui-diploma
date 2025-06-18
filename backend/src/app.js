// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const db = require('./models'); // Import the database connection and models

// Import Routers
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

// New Routers
const instructorRouter = require('./routes/instructorRouter');
const cadetRouter = require('./routes/cadetRouter');
const trainingGroupRouter = require('./routes/trainingGroupRouter');
const academicDisciplineRouter = require('./routes/academicDisciplineRouter');
const lessonRouter = require('./routes/lessonRouter');
const attendanceRouter = require('./routes/attendanceRouter');

const errorHandler = require('./middleware/catchErrorAsync');
const AppError = require('./errors/AppError');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Configure CORS as needed for production
app.use(helmet());
app.use(morgan('dev')); // Logger

// Database synchronization
db.sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use Routers
app.use('/auth', authRouter);
app.use('/users', userRouter);

// Use New Routers
app.use('/instructors', instructorRouter);
app.use('/cadets', cadetRouter);
app.use('/training-groups', trainingGroupRouter);
app.use('/academic-disciplines', academicDisciplineRouter);
app.use('/lessons', lessonRouter);
app.use('/attendances', attendanceRouter);


// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;