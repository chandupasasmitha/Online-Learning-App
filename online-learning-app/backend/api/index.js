// Vercel serverless function entry point
const app = require("../src/app");
const connectDB = require("../src/config/db");
require("dotenv").config();

// Export for Vercel
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
