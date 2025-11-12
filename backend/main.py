"""
FastAPI Backend for CampusConnect-AI
Handles webhooks, notice processing, and API endpoints
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from utils.summarizer import summarize_text
from utils.classifier import classify_notice
from utils.supabase_client import get_supabase_client

load_dotenv()

app = FastAPI(
    title="CampusConnect-AI API",
    description="AI-powered campus announcement system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Notice(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    timestamp: Optional[str] = None


class NoticeResponse(BaseModel):
    id: str
    title: str
    summary: str
    category: str
    original_content: str
    timestamp: str


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "CampusConnect-AI"}


@app.get("/api/notices")
async def get_notices(limit: int = 10):
    """Retrieve recent notices"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("notices").select("*").order("timestamp", desc=True).limit(limit).execute()
        return {"notices": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/webhook")
async def webhook(request: Request):
    """Webhook endpoint for receiving new notices"""
    try:
        payload = await request.json()
        
        # Extract notice data
        title = payload.get("title", "")
        content = payload.get("content", "")
        
        # Process the notice
        summary = summarize_text(content)
        category = classify_notice(title, content)
        
        # Store in database
        supabase = get_supabase_client()
        result = supabase.table("notices").insert({
            "title": title,
            "summary": summary,
            "category": category,
            "original_content": content,
        }).execute()
        
        return {"status": "success", "notice_id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/notices")
async def create_notice(notice: Notice):
    """Create a new notice"""
    try:
        summary = summarize_text(notice.content)
        category = classify_notice(notice.title, notice.content)
        
        supabase = get_supabase_client()
        result = supabase.table("notices").insert({
            "title": notice.title,
            "summary": summary,
            "category": category,
            "original_content": notice.content,
        }).execute()
        
        return {"status": "success", "notice": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
