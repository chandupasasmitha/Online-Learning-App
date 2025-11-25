// Enrollment routes
const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  updateProgress,
  unenrollFromCourse,
} = require("../controllers/enrollment.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

router.post("/", protect, authorize("student"), enrollInCourse);
router.get("/my-courses", protect, authorize("student"), getMyEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);
router.put("/:id/progress", protect, authorize("student"), updateProgress);
router.delete("/:id", protect, authorize("student"), unenrollFromCourse);

module.exports = router;
