// GPT controller
const openai = require("../config/gpt");
const Course = require("../models/course.model");
const { successResponse, errorResponse } = require("../utils/response");

// @desc    Get course recommendations using GPT-3
// @route   POST /api/gpt/recommendations
// @access  Private
exports.getCourseRecommendations = async (req, res) => {
  const startTime = Date.now();

  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.warn(
        `⚠️ GPT Recommendations: Empty prompt from user ${req.user.id}`
      );
      return errorResponse(res, "Please provide a prompt", 400);
    }

    console.log(`🤖 GPT Recommendations Request:`, {
      userId: req.user.id,
      promptLength: prompt.length,
      timestamp: new Date().toISOString(),
      remainingRequests: req.gptUsageInfo?.remaining || "unknown",
    });

    // Get all available courses
    const courses = await Course.find({ isPublished: true })
      .select("title description category level")
      .populate("instructor", "username");

    // Create course list for GPT context
    const courseList = courses
      .map(
        (course) =>
          `- ${course.title} (${course.category}, ${course.level}) - ${course.description}`
      )
      .join("\n");

    // Create GPT prompt
    const gptPrompt = `You are a course recommendation assistant. Based on the user's career goal or interest, recommend relevant courses from the available list.

Available Courses:
${courseList}

User Request: ${prompt}

Please recommend 3-5 most relevant courses from the list above. For each recommendation, explain why it's relevant. Format your response as a JSON array with objects containing: title, reason.`;

    // Call OpenAI API - CRITICAL: This counts toward 250 request limit
    console.log(`📡 Calling OpenAI API for course recommendations...`);
    const apiCallStart = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful educational advisor who recommends courses based on user goals and interests.",
        },
        {
          role: "user",
          content: gptPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const apiCallDuration = Date.now() - apiCallStart;
    const gptResponse = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    console.log(`✅ OpenAI API Response Received:`, {
      duration: `${apiCallDuration}ms`,
      tokensUsed,
      responseLength: gptResponse.length,
      model: completion.model,
    });

    // Try to parse JSON from GPT response
    let recommendations;
    try {
      // Extract JSON from response if it's wrapped in markdown code blocks
      const jsonMatch = gptResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(gptResponse);
      }
    } catch (parseError) {
      // If parsing fails, return the raw response
      return successResponse(res, {
        recommendations: [],
        rawResponse: gptResponse,
        message: "GPT provided recommendations in text format",
      });
    }

    // Match recommendations with actual course objects
    const recommendedCourses = recommendations.map((rec) => {
      const course = courses.find(
        (c) =>
          c.title.toLowerCase().includes(rec.title.toLowerCase()) ||
          rec.title.toLowerCase().includes(c.title.toLowerCase())
      );

      return {
        ...rec,
        course: course || null,
      };
    });

    const totalDuration = Date.now() - startTime;
    console.log(`🎯 GPT Recommendations Success:`, {
      recommendationsCount: recommendedCourses.length,
      totalDuration: `${totalDuration}ms`,
      tokensUsed,
      userId: req.user.id,
    });

    return successResponse(res, {
      recommendations: recommendedCourses,
      prompt: prompt,
      tokensUsed, // Include token usage in response
      meta: {
        requestsRemaining: req.gptUsageInfo?.remaining || null,
        totalRequests: req.gptUsageInfo?.totalRequests || null,
      },
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ GPT Recommendation Error:`, {
      userId: req.user.id,
      duration: `${totalDuration}ms`,
      errorType: error.name,
      errorMessage: error.message,
      apiError: error.response?.data?.error?.message || "N/A",
    });

    if (error.response) {
      return errorResponse(
        res,
        `OpenAI API Error: ${error.response.data.error.message}`,
        500
      );
    }

    return errorResponse(res, error.message, 500);
  }
};
