// Enrollment controller
const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const { successResponse, errorResponse } = require("../utils/response");

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student only)
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return errorResponse(res, "Course not found", 404);
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return errorResponse(res, "Already enrolled in this course", 400);
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 },
    });

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("course")
      .populate("student", "username email fullName");

    return successResponse(
      res,
      { enrollment: populatedEnrollment },
      "Successfully enrolled in course",
      201
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student only)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "username email fullName",
        },
      })
      .sort({ enrolledAt: -1 });

    return successResponse(res, {
      enrollments,
      count: enrollments.length,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Check if user is enrolled in a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
exports.checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
    });

    return successResponse(res, {
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    console.error("Check enrollment error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student only)
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    let enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return errorResponse(res, "Enrollment not found", 404);
    }

    // Check if user owns this enrollment
    if (enrollment.student.toString() !== req.user.id) {
      return errorResponse(res, "Not authorized", 403);
    }

    enrollment.progress = progress;
    if (progress >= 100) {
      enrollment.status = "completed";
    }

    await enrollment.save();

    return successResponse(
      res,
      { enrollment },
      "Progress updated successfully"
    );
  } catch (error) {
    console.error("Update progress error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/enrollments/:id
// @access  Private (Student only)
exports.unenrollFromCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return errorResponse(res, "Enrollment not found", 404);
    }

    // Check if user owns this enrollment
    if (enrollment.student.toString() !== req.user.id) {
      return errorResponse(res, "Not authorized", 403);
    }

    // Update course enrollment count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { enrollmentCount: -1 },
    });

    await enrollment.deleteOne();

    return successResponse(res, null, "Successfully unenrolled from course");
  } catch (error) {
    console.error("Unenroll error:", error);
    return errorResponse(res, error.message, 500);
  }
};
