# API Key Testing Guide

## Quick Test Endpoint

I've created a special endpoint to test your OpenAI API key **WITHOUT counting toward your 250 request limit**.

---

## Test API Key Validity

### Endpoint:

```
GET http://localhost:5000/api/gpt/test-key
```

### No Authentication Required!

Just send a GET request - no Bearer token needed.

---

## Using Postman:

1. **Open Postman**
2. **Create a new GET request**
3. **URL:** `http://localhost:5000/api/gpt/test-key`
4. **Click "Send"**

---

## Possible Responses:

### ✅ Success (Valid Key with Credits):

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "status": "valid",
    "message": "OpenAI API key is working correctly!",
    "test": {
      "response": "OK",
      "model": "gpt-3.5-turbo-0125",
      "duration": "1234ms"
    },
    "usage": {
      "totalRequests": 6,
      "remaining": 244,
      "maxRequests": 250,
      "percentageUsed": "2.40%"
    },
    "note": "This test does NOT count toward your 250 request limit as it uses a separate endpoint."
  }
}
```

### ❌ Error: API Key Not Configured

```json
{
  "status": "error",
  "message": "OpenAI API key is not configured. Please set OPENAI_API_KEY in .env file."
}
```

### ❌ Error: Invalid API Key

```json
{
  "status": "error",
  "message": "OpenAI API key test failed: Invalid API key. Please check your OPENAI_API_KEY in .env file."
}
```

### ❌ Error: Quota Exceeded

```json
{
  "status": "error",
  "message": "OpenAI API key test failed: API key is valid but has exceeded quota. Please add credits to your OpenAI account."
}
```

### ❌ Error: Connection Failed

```json
{
  "status": "error",
  "message": "OpenAI API key test failed: Cannot reach OpenAI servers. Check your internet connection."
}
```

---

## Check Usage Statistics

### Endpoint:

```
GET http://localhost:5000/api/gpt/admin/stats
```

### Requires Authentication:

You need an instructor/admin token.

### Postman Setup:

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/gpt/admin/stats`
3. **Headers:**
   - Key: `Authorization`
   - Value: `Bearer YOUR_INSTRUCTOR_TOKEN`
4. **Click "Send"**

### Response:

```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalRequests": 6,
      "remaining": 244,
      "maxRequests": 250,
      "percentageUsed": "2.40%"
    },
    "byEndpoint": {
      "recommendations": 6,
      "chat": 0
    },
    "successRate": {
      "successful": 0,
      "failed": 6,
      "rate": "0.00%"
    },
    "tokens": {
      "totalTokens": 0,
      "avgTokens": 0,
      "maxTokens": 0
    },
    "topUsers": [...],
    "recentRequests": [...],
    "requestsByDate": [...]
  }
}
```

---

## Quick Testing Workflow:

1. **Add API key to `.env`:**

   ```env
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

2. **Restart backend server:**

   ```bash
   npm run dev
   ```

3. **Test the key (Postman):**

   ```
   GET http://localhost:5000/api/gpt/test-key
   ```

4. **If successful, check usage:**
   ```
   GET http://localhost:5000/api/gpt/admin/stats
   ```
   (Requires instructor token)

---

## Benefits:

✅ **Does NOT count toward 250 limit** - Test endpoint is separate
✅ **No authentication needed** - Easy to test quickly
✅ **Clear error messages** - Know exactly what's wrong
✅ **Shows current usage** - See how many requests you have left
✅ **Fast feedback** - Test in seconds

---

## Notes:

- The test endpoint makes a minimal API call (5 tokens max)
- It's designed to verify the key works without wasting your quota
- Use this to troubleshoot API key issues
- Once you confirm the key works, use the regular endpoints for actual features

---

**Ready to test!** 🚀
