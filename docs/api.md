# API Documentation

## Overview

The CampusConnect-AI backend provides a RESTful API for managing campus notices with AI-powered summarization and categorization.

## Base URL

```
Development: http://localhost:8000
Production: https://your-domain.com
```

## Authentication

Currently, the API does not require authentication. For production use, consider implementing:
- API keys
- JWT tokens
- OAuth 2.0

## Endpoints

### Health Check

**GET /**

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "CampusConnect-AI"
}
```

### Get Notices

**GET /api/notices**

Retrieve a list of notices.

**Query Parameters:**
- `limit` (integer, optional): Maximum number of notices to return (default: 10)

**Response:**
```json
{
  "notices": [
    {
      "id": "uuid",
      "title": "Exam Schedule",
      "summary": "Final exams next week...",
      "category": "Academic",
      "original_content": "Full content...",
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Notice

**POST /api/notices**

Create a new notice.

**Request Body:**
```json
{
  "title": "Campus Event",
  "content": "Details about the event...",
  "category": "Events",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**Response:**
```json
{
  "status": "success",
  "notice": {
    "id": "uuid",
    "title": "Campus Event",
    "summary": "AI-generated summary...",
    "category": "Events"
  }
}
```

### Webhook

**POST /api/webhook**

Receive external notice updates.

**Request Body:**
```json
{
  "title": "Notice Title",
  "content": "Notice content..."
}
```

**Response:**
```json
{
  "status": "success",
  "notice_id": "uuid"
}
```

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid request format"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Error message"
}
```

## Categories

Available notice categories:
- Academic
- Events
- Sports
- Clubs
- Administration
- Placement
- Workshop
- Scholarship
- General

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production:
- Per IP address
- Per API key
- Sliding window algorithm

## CORS

CORS is configured to allow all origins in development. For production:
- Specify allowed origins in `ALLOWED_ORIGINS` environment variable
- Update CORS middleware configuration
