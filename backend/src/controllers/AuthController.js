const jwt = require('jsonwebtoken');
const db = require('../models');
const AppError = require('../errors/AppError');
const catchErrorAsync = require('../middleware/catchErrorAsync');

// Функція для підпису токена
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_default_secret_key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

// Функція для створення і відправки токена
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    // Видаляємо пароль з об'єкта користувача перед відправкою
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// Метод для логіну
exports.login = catchErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Перевірка, чи існують логін та пароль
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Пошук користувача та перевірка паролю
    const user = await db.User.findOne({ where: { email } });

    if (!user || !(await user.isValidPassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Якщо все добре, відправляємо токен клієнту
    createSendToken(user, 200, res);
});

// Метод для отримання даних про себе
exports.getMe = catchErrorAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});