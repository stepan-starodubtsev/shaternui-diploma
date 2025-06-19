const jwt = require('jsonwebtoken');
const db = require('../models');
const AppError = require('../errors/AppError');
const catchErrorAsync = require('./catchErrorAsync');

module.exports = catchErrorAsync(async (req, res, next) => {
    let token;
    // Перевіряємо, чи є заголовок Authorization і чи починається він з "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Верифікуємо токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');

    // Знаходимо користувача за ID з токена
    const currentUser = await db.User.findByPk(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // Додаємо користувача до об'єкта запиту
    req.user = currentUser;
    next();
});