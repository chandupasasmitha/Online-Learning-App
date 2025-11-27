// GPT API Request Tracking and Limiting Middleware
const GptUsage = require("../models/gpt-usage.model");
const { errorResponse } = require("../utils/response");

// Maximum allowed API requests
const MAX_API_REQUESTS = 250;

/**
 * Middleware to check if API request limit has been exceeded
 * Prevents making more than 250 GPT API requests
 */
exports.checkApiLimit = async (req, res, next) => {
  try {
    // Check if limit has been exceeded
    const isExceeded = await GptUsage.isLimitExceeded(MAX_API_REQUESTS);

    if (isExceeded) {
      const totalRequests = await GptUsage.getTotalRequestCount();

      console.error(
        `❌ GPT API LIMIT EXCEEDED: ${totalRequests}/${MAX_API_REQUESTS} requests used`
      );

      return errorResponse(
        res,
        `API request limit exceeded. Maximum ${MAX_API_REQUESTS} requests allowed. Total requests made: ${totalRequests}`,
        429 // Too Many Requests
      );
    }

    // Get remaining requests for logging
    const remaining = await GptUsage.getRemainingRequests(MAX_API_REQUESTS);
    const totalRequests = await GptUsage.getTotalRequestCount();

    console.log(
      `✅ GPT API Request Check: ${totalRequests}/${MAX_API_REQUESTS} used, ${remaining} remaining`
    );

    // Attach usage info to request for later use
    req.gptUsageInfo = {
      totalRequests,
      remaining,
      maxRequests: MAX_API_REQUESTS,
    };

    next();
  } catch (error) {
    console.error("Error checking API limit:", error);
    return errorResponse(res, "Error checking API limit", 500);
  }
};

/**
 * Middleware to log GPT API request
 * Saves request details to database for tracking
 */
exports.logApiRequest = async (req, res, next) => {
  // Store original send function
  const originalSend = res.send;

  // Override send function to capture response
  res.send = function (data) {
    // Restore original send
    res.send = originalSend;

    // Parse response data
    let responseData;
    try {
      responseData = typeof data === "string" ? JSON.parse(data) : data;
    } catch (e) {
      responseData = {};
    }

    // Log the request after response is sent
    const logData = {
      user: req.user.id,
      endpoint: req.path.includes("recommendations")
        ? "recommendations"
        : "chat",
      prompt: req.body.prompt || req.body.message || "",
      promptLength: (req.body.prompt || req.body.message || "").length,
      responseLength: JSON.stringify(data).length,
      tokensUsed: responseData.data?.tokensUsed || 0,
      success: res.statusCode === 200,
      errorMessage: res.statusCode !== 200 ? responseData.message : undefined,
      ipAddress:
        req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    };

    // Save log asynchronously (don't wait for it)
    GptUsage.create(logData)
      .then((usage) => {
        console.log(
          `📝 GPT API Request Logged: ID=${usage._id}, User=${usage.user}, Endpoint=${usage.endpoint}, Success=${usage.success}`
        );
      })
      .catch((err) => {
        console.error("❌ Failed to log GPT API request:", err.message);
      });

    // Send the actual response
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Rate limiting middleware to prevent rapid repeated requests
 * Limits to 5 requests per minute per user
 */
const userRequestTimestamps = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute

exports.rateLimitGptRequests = (req, res, next) => {
  const userId = req.user.id;
  const now = Date.now();

  // Get user's recent request timestamps
  if (!userRequestTimestamps.has(userId)) {
    userRequestTimestamps.set(userId, []);
  }

  const timestamps = userRequestTimestamps.get(userId);

  // Remove timestamps older than the rate limit window
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  // Check if user has exceeded rate limit
  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestTimestamp = Math.min(...recentTimestamps);
    const timeUntilReset = Math.ceil(
      (RATE_LIMIT_WINDOW - (now - oldestTimestamp)) / 1000
    );

    console.warn(
      `⚠️ Rate limit exceeded for user ${userId}: ${recentTimestamps.length} requests in last minute`
    );

    return errorResponse(
      res,
      `Rate limit exceeded. Please wait ${timeUntilReset} seconds before trying again. Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute allowed.`,
      429
    );
  }

  // Add current timestamp
  recentTimestamps.push(now);
  userRequestTimestamps.set(userId, recentTimestamps);

  // Clean up old entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    for (const [uid, stamps] of userRequestTimestamps.entries()) {
      const validStamps = stamps.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
      );
      if (validStamps.length === 0) {
        userRequestTimestamps.delete(uid);
      } else {
        userRequestTimestamps.set(uid, validStamps);
      }
    }
  }

  next();
};

/**
 * Middleware to add usage statistics to response headers
 */
exports.addUsageHeaders = (req, res, next) => {
  if (req.gptUsageInfo) {
    res.set({
      "X-API-Requests-Total": req.gptUsageInfo.totalRequests,
      "X-API-Requests-Remaining": req.gptUsageInfo.remaining,
      "X-API-Requests-Limit": req.gptUsageInfo.maxRequests,
    });
  }
  next();
};
