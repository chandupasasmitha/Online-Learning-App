// GPT routes
const express = require("express");
const router = express.Router();
const {
  getCourseRecommendations,
  chatWithGPT,
} = require("../controllers/gpt.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/recommendations", protect, getCourseRecommendations);
router.post("/chat", protect, chatWithGPT);

module.exports = router;
