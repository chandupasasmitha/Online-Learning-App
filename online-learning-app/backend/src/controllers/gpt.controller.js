// GPT controller
const openai = require("../config/gpt");
const Course = require("../models/course.model");
const { successResponse, errorResponse } = require("../utils/response");

// @desc    Get course recommendations using GPT-3
// @route   POST /api/gpt/recommendations
// @access  Private
exports.getCourseRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return errorResponse(res, "Please provide a prompt", 400);
    }

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

    // Call OpenAI API
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

    const gptResponse = completion.choices[0].message.content;

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

    return successResponse(res, {
      recommendations: recommendedCourses,
      prompt: prompt,
    });
  } catch (error) {
    console.error("GPT recommendation error:", error);

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

// @desc    General chat with GPT about courses
// @route   POST /api/gpt/chat
// @access  Private
exports.chatWithGPT = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return errorResponse(res, "Please provide a message", 400);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful educational advisor for an online learning platform. Help users with course-related questions, learning paths, and career advice.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    return successResponse(res, {
      response,
      message,
    });
  } catch (error) {
    console.error("GPT chat error:", error);

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
