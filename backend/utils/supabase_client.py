import os
from supabase import create_client

# Load environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Supabase environment variables not set.")

def get_supabase_client():
    return create_client(SUPABASE_URL, SUPABASE_KEY)
