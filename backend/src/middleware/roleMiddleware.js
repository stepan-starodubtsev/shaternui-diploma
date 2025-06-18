const {ROLES} = require('../config/constants');

const roleMiddleware = (permissions) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            return next();
        }

        try {
            if (!req.user || !req.user.user || !req.user.user.role) {
                console.warn('User data or role not found in req.user. Payload structure:', req.user);
                return res.status(403).json({message: "User not authenticated or role missing in token."});
            }

            const userRole = req.user.user.role;
            const userPermissions = permissions[userRole];

            if (!userPermissions) {
                return res.status(403).json({
                    message: "Access Denied: No permissions defined for your role" +
                        "on this resource."
                });
            }

            if (userPermissions.forbiddenRoutes) {
                const requestedPath = req.baseUrl + (req.path === '/' ? '' : req.path);
                if (userPermissions.forbiddenRoutes.some(forbiddenPath => requestedPath.startsWith(forbiddenPath))) {
                    return res.status(403).json({
                        message: `Access Denied: Your role (${userRole}) 
                    cannot access ${requestedPath}.`
                    });
                }
            }

            if (userPermissions.methods && userPermissions.methods !== '*') {
                if (Array.isArray(userPermissions.methods) && !userPermissions.methods.includes(req.method)) {
                    return res.status(403).json({
                        message: `Access Denied: Method ${req.method}
                     not allowed for your role (${userRole}) on this resource.`
                    });
                }
            }

            next();
        } catch (e) {
            console.error("Role middleware error:", e);
            return res.status(403).json({message: "Authorization error."});
        }
    };
};

module.exports = roleMiddleware;