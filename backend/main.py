"""
FastAPI Backend for CampusConnect-AI
Handles webhooks, notice processing, and API endpoints
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
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

# ------------------------------------------------------
# CORS (Correction #1)
# ------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # later restrict to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------
# Models
# ------------------------------------------------------
class Notice(BaseModel):
    title: str
    content: str
    category: Optional[str] = None


# ------------------------------------------------------
# Health Check
# ------------------------------------------------------
@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "CampusConnect-AI"
    }


# ------------------------------------------------------
# Fetch Notices (Correction #3: created_at instead of timestamp)
# ------------------------------------------------------
@app.get("/api/notices")
async def get_notices(limit: int = 10):
    try:
        supabase = get_supabase_client()
        response = (
            supabase.table("notices")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return {"notices": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------
# Telegram Webhook (Correction #2 & #3)
# ------------------------------------------------------
@app.post("/webhook/telegram")
async def receive_update(request: Request):
    try:
        payload = await request.json()
        message = payload.get("message") or payload.get("channel_post")

        if not message:
            return {"status": "ignored", "reason": "No message found"}

        # Correction #3 — Safe text extraction
        text = ""

        # Normal text
        if "text" in message:
            text = message["text"]

        # Captions
        elif "caption" in message:
            text = message["caption"]

        # Replies with text
        elif "reply_to_message" in message and "text" in message["reply_to_message"]:
            text = message["reply_to_message"]["text"]

        if not text or text.strip() == "":
            return {"status": "ignored", "reason": "No usable text found"}

        # AI Processing
        summary = summarize_text(text)
        category = classify_notice("Notice", text)

        supabase = get_supabase_client()

        result = (
            supabase.table("notices")
            .insert({
                "title": "Telegram Notice",
                "summary": summary,
                "category": category,
                "original_content": text
            })
            .execute()
        )

        return {
            "status": "success",
            "notice_id": result.data[0]["id"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------
# Manual POST route (/api/notices)
# ------------------------------------------------------
@app.post("/api/notices")
async def create_notice(notice: Notice):
    try:
        summary = summarize_text(notice.content)
        category = classify_notice(notice.title, notice.content)

        supabase = get_supabase_client()

        result = (
            supabase.table("notices")
            .insert({
                "title": notice.title,
                "summary": summary,
                "category": category,
                "original_content": notice.content,
            })
            .execute()
        )

        return {
            "status": "success",
            "notice": result.data[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------
# Local Dev Runner
# ------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
