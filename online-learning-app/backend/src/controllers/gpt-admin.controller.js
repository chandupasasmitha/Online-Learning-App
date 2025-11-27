// GPT Admin Controller - For viewing API usage statistics
const GptUsage = require("../models/gpt-usage.model");
const { successResponse, errorResponse } = require("../utils/response");
const openai = require("../config/gpt");

// @desc    Get GPT API usage statistics
// @route   GET /api/gpt/admin/stats
// @access  Private (Admin/Instructor)
exports.getUsageStats = async (req, res) => {
  try {
    const totalRequests = await GptUsage.getTotalRequestCount();
    const remaining = await GptUsage.getRemainingRequests(250);

    // Get requests by endpoint
    const recommendationRequests = await GptUsage.countDocuments({
      endpoint: "recommendations",
    });
    const chatRequests = await GptUsage.countDocuments({
      endpoint: "chat",
    });

    // Get success rate
    const successfulRequests = await GptUsage.countDocuments({
      success: true,
    });
    const failedRequests = await GptUsage.countDocuments({
      success: false,
    });

    // Get total tokens used
    const tokenStats = await GptUsage.aggregate([
      {
        $group: {
          _id: null,
          totalTokens: { $sum: "$tokensUsed" },
          avgTokens: { $avg: "$tokensUsed" },
          maxTokens: { $max: "$tokensUsed" },
        },
      },
    ]);

    // Get top users
    const topUsers = await GptUsage.aggregate([
      {
        $group: {
          _id: "$user",
          requestCount: { $sum: 1 },
          totalTokens: { $sum: "$tokensUsed" },
        },
      },
      { $sort: { requestCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          userId: "$_id",
          username: { $arrayElemAt: ["$userInfo.username", 0] },
          email: { $arrayElemAt: ["$userInfo.email", 0] },
          requestCount: 1,
          totalTokens: 1,
        },
      },
    ]);

    // Get recent requests
    const recentRequests = await GptUsage.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("user", "username email")
      .select("-userAgent -ipAddress");

    // Get requests by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const requestsByDate = await GptUsage.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          tokens: { $sum: "$tokensUsed" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, {
      summary: {
        totalRequests,
        remaining,
        maxRequests: 250,
        percentageUsed: ((totalRequests / 250) * 100).toFixed(2) + "%",
      },
      byEndpoint: {
        recommendations: recommendationRequests,
        chat: chatRequests,
      },
      successRate: {
        successful: successfulRequests,
        failed: failedRequests,
        rate:
          totalRequests > 0
            ? ((successfulRequests / totalRequests) * 100).toFixed(2) + "%"
            : "N/A",
      },
      tokens: tokenStats[0] || {
        totalTokens: 0,
        avgTokens: 0,
        maxTokens: 0,
      },
      topUsers,
      recentRequests,
      requestsByDate,
    });
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get all GPT API request logs
// @route   GET /api/gpt/admin/logs
// @access  Private (Admin/Instructor)
exports.getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const logs = await GptUsage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username email role");

    const total = await GptUsage.countDocuments();

    return successResponse(res, {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get user's GPT API request history
// @route   GET /api/gpt/admin/user/:userId
// @access  Private (Admin/Instructor)
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await GptUsage.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100);

    const userRequestCount = await GptUsage.getUserRequestCount(userId);

    return successResponse(res, {
      userId,
      requestCount: userRequestCount,
      logs,
    });
  } catch (error) {
    console.error("Error fetching user logs:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Export all logs as CSV
// @route   GET /api/gpt/admin/export
// @access  Private (Admin/Instructor)
exports.exportLogs = async (req, res) => {
  try {
    const logs = await GptUsage.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    // Create CSV content
    const csvHeader =
      "Timestamp,User Email,Username,Endpoint,Prompt Length,Response Length,Tokens Used,Success,Error Message\n";
    const csvRows = logs
      .map((log) => {
        return [
          log.createdAt.toISOString(),
          log.user?.email || "N/A",
          log.user?.username || "N/A",
          log.endpoint,
          log.promptLength,
          log.responseLength,
          log.tokensUsed,
          log.success,
          (log.errorMessage || "").replace(/,/g, ";"),
        ].join(",");
      })
      .join("\n");

    const csv = csvHeader + csvRows;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=gpt-usage-logs-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );

    return res.send(csv);
  } catch (error) {
    console.error("Error exporting logs:", error);
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Test OpenAI API key validity (does NOT count toward 250 limit)
// @route   GET /api/gpt/test-key
// @access  Public or Private (optional authentication)
exports.testApiKey = async (req, res) => {
  try {
    console.log("🔑 Testing OpenAI API Key...");

    // Check if API key is configured
    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here" ||
      process.env.OPENAI_API_KEY === "your_valid_api_key_here"
    ) {
      return errorResponse(
        res,
        "OpenAI API key is not configured. Please set OPENAI_API_KEY in .env file.",
        400
      );
    }

    // Get current usage stats
    const totalRequests = await GptUsage.getTotalRequestCount();
    const remaining = await GptUsage.getRemainingRequests(250);

    // Make a minimal API call to test the key (uses very few tokens)
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'OK' if you can read this.",
        },
      ],
      max_tokens: 5,
      temperature: 0,
    });

    const duration = Date.now() - startTime;
    const response = completion.choices[0].message.content;

    console.log("✅ API Key Test Successful:", {
      duration: `${duration}ms`,
      model: completion.model,
      response,
    });

    return successResponse(res, {
      status: "valid",
      message: "OpenAI API key is working correctly!",
      test: {
        response,
        model: completion.model,
        duration: `${duration}ms`,
      },
      usage: {
        totalRequests,
        remaining,
        maxRequests: 250,
        percentageUsed: ((totalRequests / 250) * 100).toFixed(2) + "%",
      },
      note: "This test does NOT count toward your 250 request limit as it uses a separate endpoint.",
    });
  } catch (error) {
    console.error("❌ API Key Test Failed:", {
      errorType: error.name,
      errorMessage: error.message,
      statusCode: error.response?.status,
    });

    let errorMsg = "OpenAI API key test failed: ";
    let statusCode = 500;

    if (
      error.message.includes("401") ||
      error.message.includes("Incorrect API key")
    ) {
      errorMsg +=
        "Invalid API key. Please check your OPENAI_API_KEY in .env file.";
      statusCode = 401;
    } else if (
      error.message.includes("429") ||
      error.message.includes("quota")
    ) {
      errorMsg +=
        "API key is valid but has exceeded quota. Please add credits to your OpenAI account.";
      statusCode = 429;
    } else if (
      error.message.includes("timeout") ||
      error.message.includes("ECONNREFUSED")
    ) {
      errorMsg +=
        "Cannot reach OpenAI servers. Check your internet connection.";
      statusCode = 503;
    } else {
      errorMsg += error.message;
    }

    return errorResponse(res, errorMsg, statusCode);
  }
};
