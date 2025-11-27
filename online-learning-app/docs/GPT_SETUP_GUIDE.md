# Quick Setup Guide - GPT API Assessment Features

## Prerequisites

- MongoDB running and connected
- Node.js backend server running
- OpenAI API key configured in `.env`

## Step 1: Install Dependencies

All dependencies should already be installed. If not:

```bash
cd backend
npm install
```

## Step 2: Configure Environment

Ensure your `.env` file has:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

## Step 3: Start the Server

```bash
cd backend
npm run dev
```

## Step 4: Test the Implementation

### A. Check Usage Statistics (Instructor/Admin Only)

```bash
GET http://localhost:5000/api/gpt/admin/stats
Authorization: Bearer <instructor_or_admin_token>
```

### B. Make a GPT Request (Any Authenticated User)

```bash
POST http://localhost:5000/api/gpt/recommendations
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "prompt": "I want to learn web development"
}
```

### C. View Request Logs (Instructor/Admin Only)

```bash
GET http://localhost:5000/api/gpt/admin/logs
Authorization: Bearer <instructor_or_admin_token>
```

### D. Export Usage Logs (Instructor/Admin Only)

```bash
GET http://localhost:5000/api/gpt/admin/export
Authorization: Bearer <instructor_or_admin_token>
```

## How to Get Tokens

### For Testing:

1. Register a student account via mobile app or API
2. Login to get JWT token
3. Use the token in Authorization header

### For Admin Access:

1. Register an instructor account
2. Or manually update a user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "instructor" } }
);
```

## Monitoring the System

### Console Logs to Watch For:

```
✅ GPT API Request Check: 15/250 used, 235 remaining
🤖 GPT Recommendations Request: { userId, promptLength, ... }
📡 Calling OpenAI API for course recommendations...
✅ OpenAI API Response Received: { duration, tokensUsed, ... }
🎯 GPT Recommendations Success: { recommendationsCount, ... }
📝 GPT API Request Logged: ID=..., User=..., Endpoint=...
```

### When Limit is Exceeded:

```
❌ GPT API LIMIT EXCEEDED: 250/250 requests used
```

Returns HTTP 429 with error message.

### When Rate Limited:

```
⚠️ Rate limit exceeded for user ...: 5 requests in last minute
```

Returns HTTP 429 with retry-after time.

## Features Implemented

✅ **Request Limit (250 max)**

- Automatically tracks and enforces limit
- Rejects requests when limit exceeded

✅ **Request Logging**

- Every request logged to MongoDB
- Includes: user, prompt, tokens, success, timestamp, etc.

✅ **No Loops**

- No API calls within loops
- Rate limiter prevents rapid requests (5/min per user)

✅ **Error Handling**

- Comprehensive try-catch blocks
- User-friendly error messages
- Detailed error logging

✅ **API Key Security**

- Stored in .env file
- Excluded from Git
- Never exposed in responses

✅ **Admin Dashboard**

- Usage statistics
- Request logs
- CSV export
- User analytics

## Troubleshooting

### Issue: "API request limit exceeded"

**Solution**: The 250 request limit has been reached. This is expected behavior per assessment requirements.

### Issue: "Rate limit exceeded"

**Solution**: Wait 60 seconds before making another request. This prevents accidental loops.

### Issue: "OpenAI API Error"

**Solution**: Check your API key in `.env` file and verify it's valid.

### Issue: Logs not appearing

**Solution**: Ensure MongoDB is connected and the `gptusages` collection exists.

## API Endpoints Reference

| Endpoint                      | Method | Auth       | Purpose                    |
| ----------------------------- | ------ | ---------- | -------------------------- |
| `/api/gpt/recommendations`    | POST   | User       | Get course recommendations |
| `/api/gpt/chat`               | POST   | User       | Chat with GPT              |
| `/api/gpt/admin/stats`        | GET    | Instructor | View usage statistics      |
| `/api/gpt/admin/logs`         | GET    | Instructor | View all request logs      |
| `/api/gpt/admin/user/:userId` | GET    | Instructor | View user's logs           |
| `/api/gpt/admin/export`       | GET    | Instructor | Export logs as CSV         |

## Response Headers

All GPT API responses include:

```
X-API-Requests-Total: 15
X-API-Requests-Remaining: 235
X-API-Requests-Limit: 250
```

## Documentation

For complete implementation details, see:

- `docs/GPT_API_IMPLEMENTATION.md` - Full documentation
- `backend/src/models/gpt-usage.model.js` - Database model
- `backend/src/middleware/gpt-tracking.middleware.js` - Tracking logic
- `backend/src/controllers/gpt.controller.js` - API controllers

---

**Ready to use!** All GPT API assessment requirements are fully implemented and operational.
