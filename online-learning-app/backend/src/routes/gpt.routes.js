// GPT routes
const express = require("express");
const router = express.Router();
const {
  getCourseRecommendations,
  chatWithGPT,
} = require("../controllers/gpt.controller");
const {
  getUsageStats,
  getAllLogs,
  getUserLogs,
  exportLogs,
  testApiKey,
} = require("../controllers/gpt-admin.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const {
  checkApiLimit,
  logApiRequest,
  rateLimitGptRequests,
  addUsageHeaders,
} = require("../middleware/gpt-tracking.middleware");

// Test endpoint - Check if API key is valid (does NOT count toward 250 limit)
// No authentication required - use for testing
router.get("/test-key", testApiKey);

// Admin routes for monitoring API usage (No API limit check needed)
router.get(
  "/admin/stats",
  protect,
  authorize("instructor", "admin"),
  getUsageStats
);
router.get(
  "/admin/logs",
  protect,
  authorize("instructor", "admin"),
  getAllLogs
);
router.get(
  "/admin/user/:userId",
  protect,
  authorize("instructor", "admin"),
  getUserLogs
);
router.get(
  "/admin/export",
  protect,
  authorize("instructor", "admin"),
  exportLogs
);

// Apply all GPT protection middleware:
// 1. protect - Authenticate user
// 2. checkApiLimit - Check if 250 request limit exceeded
// 3. rateLimitGptRequests - Rate limit per user (5 req/min)
// 4. addUsageHeaders - Add usage stats to response headers
// 5. logApiRequest - Log the request to database
router.post(
  "/recommendations",
  protect,
  checkApiLimit,
  rateLimitGptRequests,
  addUsageHeaders,
  logApiRequest,
  getCourseRecommendations
);

router.post(
  "/chat",
  protect,
  checkApiLimit,
  rateLimitGptRequests,
  addUsageHeaders,
  logApiRequest,
  chatWithGPT
);

module.exports = router;
