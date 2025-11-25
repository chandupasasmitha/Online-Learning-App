// RBAC role check middleware
const { errorResponse } = require("../utils/response");

// Middleware to check if user has required role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Not authenticated", 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};
