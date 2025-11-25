// Course controller
const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");
const { successResponse, errorResponse } = require("../utils/response");

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, content, category, level, duration, price } =
      req.body;

    const course = await Course.create({
      title,
      description,
      content,
      category,
      level,
      duration,
      price,
      instructor: req.user.id,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      "instructor",
      "username email fullName"
    );

    return successResponse(
      res,
      { course: populatedCourse },
      "Course created successfully",
      201
    );
  } catch (error) {
    console.error("Create course error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    let query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate("instructor", "username email fullName")
      .sort({ createdAt: -1 });

    return successResponse(res, {
      courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "username email fullName"
    );

    if (!course) {
      return errorResponse(res, "Course not found", 404);
    }

    return successResponse(res, { course });
  } catch (error) {
    console.error("Get course error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor only - own courses)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return errorResponse(res, "Course not found", 404);
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return errorResponse(res, "Not authorized to update this course", 403);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("instructor", "username email fullName");

    return successResponse(res, { course }, "Course updated successfully");
  } catch (error) {
    console.error("Update course error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor only - own courses)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return errorResponse(res, "Course not found", 404);
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return errorResponse(res, "Not authorized to delete this course", 403);
    }

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ course: req.params.id });

    await course.deleteOne();

    return successResponse(res, null, "Course deleted successfully");
  } catch (error) {
    console.error("Delete course error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor only)
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("instructor", "username email fullName")
      .sort({ createdAt: -1 });

    return successResponse(res, {
      courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get enrolled students for a course
// @route   GET /api/courses/:id/students
// @access  Private (Instructor only - own courses)
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return errorResponse(res, "Course not found", 404);
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return errorResponse(res, "Not authorized to view students", 403);
    }

    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate("student", "username email fullName")
      .sort({ enrolledAt: -1 });

    return successResponse(res, {
      students: enrollments.map((e) => ({
        id: e.student._id,
        username: e.student.username,
        email: e.student.email,
        fullName: e.student.fullName,
        enrolledAt: e.enrolledAt,
        status: e.status,
        progress: e.progress,
      })),
      count: enrollments.length,
    });
  } catch (error) {
    console.error("Get course students error:", error);
    return errorResponse(res, error.message, 500);
  }
};
