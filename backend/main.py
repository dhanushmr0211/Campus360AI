"""
FastAPI Backend for CampusConnect-AI
"""
from utils.summarizer import summarize_text

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
# CORS CONFIG (IMPORTANT)
# ------------------------------------------------------
origins = [
    "http://localhost:3000",            # Local frontend
    "https://campus360-ai-hmdp.vercel.app",  # Vercel deployment URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    return {"status": "healthy", "service": "CampusConnect-AI"}


# ------------------------------------------------------
# Fetch Notices
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
        raise HTTPException(500, str(e))


# ------------------------------------------------------
# Telegram Webhook
# ------------------------------------------------------
@app.post("/webhook/telegram")
async def receive_update(request: Request):
    try:
        payload = await request.json()
        message = payload.get("message") or payload.get("channel_post")

        if not message:
            return {"status": "ignored", "reason": "No message found"}

        # Extract text safely
        text = (
            message.get("text")
            or message.get("caption")
            or (message.get("reply_to_message", {}).get("text"))
        )

        if not text or text.strip() == "":
            return {"status": "ignored", "reason": "No usable text"}

        summary = summarize_text(text)
        category = classify_notice("Telegram Notice", text)

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

        return {"status": "success", "notice_id": result.data[0]["id"]}

    except Exception as e:
        raise HTTPException(500, str(e))


# ------------------------------------------------------
# Manual Notice POST
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
        return {"status": "success", "notice": result.data[0]}

    except Exception as e:
        raise HTTPException(500, str(e))


# ------------------------------------------------------
# Local Development Runner
# ------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
