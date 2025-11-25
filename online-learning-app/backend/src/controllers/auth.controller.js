// Authentication controller
const User = require("../models/user.model");
const { generateToken } = require("../utils/generateToken");
const { successResponse, errorResponse } = require("../utils/response");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, fullName } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return errorResponse(
        res,
        "User already exists with this email or username",
        400
      );
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "student",
      fullName,
    });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        token,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(res, "Please provide email and password", 400);
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    // Generate token
    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return successResponse(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return errorResponse(res, error.message, 500);
  }
};
