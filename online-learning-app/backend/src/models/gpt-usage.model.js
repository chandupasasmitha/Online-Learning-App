// GPT API Usage Tracking Model
const mongoose = require("mongoose");

const gptUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
      enum: ["recommendations", "chat"],
    },
    prompt: {
      type: String,
      required: true,
    },
    promptLength: {
      type: Number,
      required: true,
    },
    responseLength: {
      type: Number,
      default: 0,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
gptUsageSchema.index({ user: 1, createdAt: -1 });
gptUsageSchema.index({ createdAt: -1 });

// Static method to get total request count
gptUsageSchema.statics.getTotalRequestCount = async function () {
  return await this.countDocuments();
};

// Static method to get user's request count
gptUsageSchema.statics.getUserRequestCount = async function (userId) {
  return await this.countDocuments({ user: userId });
};

// Static method to check if limit exceeded
gptUsageSchema.statics.isLimitExceeded = async function (limit = 250) {
  const count = await this.getTotalRequestCount();
  return count >= limit;
};

// Static method to get remaining requests
gptUsageSchema.statics.getRemainingRequests = async function (limit = 250) {
  const count = await this.getTotalRequestCount();
  return Math.max(0, limit - count);
};

module.exports = mongoose.model("GptUsage", gptUsageSchema);
