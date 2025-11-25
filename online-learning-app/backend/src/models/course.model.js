// Course model
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
    },
    content: {
      type: String,
      required: [true, "Course content is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: String,
      default: "Self-paced",
    },
    price: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Course+Thumbnail",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
courseSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Course", courseSchema);
