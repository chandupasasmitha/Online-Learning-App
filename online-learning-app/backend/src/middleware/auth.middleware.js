// JWT verify middleware
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorResponse } = require("../utils/response");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, "Not authorized to access this route", 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return errorResponse(res, "User not found", 404);
      }

      next();
    } catch (error) {
      return errorResponse(res, "Not authorized, token failed", 401);
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return errorResponse(res, "Server error in authentication", 500);
  }
};
