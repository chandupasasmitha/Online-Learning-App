// Course routes
const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCourseStudents,
} = require("../controllers/course.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Instructor routes
router.post("/", protect, authorize("instructor"), createCourse);
router.put("/:id", protect, authorize("instructor"), updateCourse);
router.delete("/:id", protect, authorize("instructor"), deleteCourse);
router.get(
  "/instructor/my-courses",
  protect,
  authorize("instructor"),
  getInstructorCourses
);
router.get(
  "/:id/students",
  protect,
  authorize("instructor"),
  getCourseStudents
);

module.exports = router;
