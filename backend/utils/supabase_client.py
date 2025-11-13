import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    """Create and return a Supabase client"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise Exception("❌ Supabase environment variables not set.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def insert_notice(message_id, original_text, summary, category):
    """Insert a notice into the Supabase DB (used by fallback)"""
    supabase = get_supabase_client()

    try:
        # Avoid inserting duplicate messages
        existing = (
            supabase.table("notices")
            .select("*")
            .eq("tg_message_id", str(message_id))
            .execute()
        )

        if existing.data:
            return existing.data[0]

        data = {
            "tg_message_id": str(message_id),
            "source": "telegram",
            "original_text": original_text,
            "summary": summary,
            "category": category,
        }

        response = supabase.table("notices").insert(data).execute()
        return response.data[0]

    except Exception as e:
        print("❌ Supabase insert failed:", e)
        return None
