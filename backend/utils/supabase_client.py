"""
Supabase client initialization and utilities
"""
import os
from supabase import create_client, Client
from typing import Optional


_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Get or create a Supabase client instance.
    
    Returns:
        Supabase client
        
    Raises:
        ValueError: If Supabase credentials are not configured
    """
    global _supabase_client
    
    if _supabase_client is not None:
        return _supabase_client
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        raise ValueError(
            "Supabase credentials not found. "
            "Please set SUPABASE_URL and SUPABASE_KEY environment variables."
        )
    
    _supabase_client = create_client(url, key)
    return _supabase_client


def reset_client():
    """Reset the Supabase client (useful for testing)"""
    global _supabase_client
    _supabase_client = None
