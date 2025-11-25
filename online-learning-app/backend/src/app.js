// Express app configuration
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const gptRoutes = require("./routes/gpt.routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/gpt", gptRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

module.exports = app;
