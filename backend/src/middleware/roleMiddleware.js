const AppError = require('../errors/AppError');

module.exports = (roles) => {
    return (req, res, next) => {
        // ролі передаються як масив, наприклад: ['ADMIN', 'INSTRUCTOR']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};