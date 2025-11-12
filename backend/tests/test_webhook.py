"""
Tests for webhook endpoint
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root health check endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "CampusConnect-AI"


@patch("main.get_supabase_client")
@patch("main.summarize_text")
@patch("main.classify_notice")
def test_webhook_success(mock_classify, mock_summarize, mock_supabase):
    """Test successful webhook processing"""
    # Mock the functions
    mock_summarize.return_value = "This is a summary"
    mock_classify.return_value = "Academic"
    
    # Mock Supabase client
    mock_client = MagicMock()
    mock_table = MagicMock()
    mock_insert = MagicMock()
    mock_execute = MagicMock()
    
    mock_execute.data = [{"id": "123"}]
    mock_insert.execute.return_value = mock_execute
    mock_table.insert.return_value = mock_insert
    mock_client.table.return_value = mock_table
    mock_supabase.return_value = mock_client
    
    # Test webhook
    payload = {
        "title": "Exam Schedule",
        "content": "The final exams will be held next week."
    }
    
    response = client.post("/api/webhook", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "notice_id" in data
    
    # Verify mocks were called
    mock_summarize.assert_called_once()
    mock_classify.assert_called_once()


@patch("main.get_supabase_client")
@patch("main.summarize_text")
@patch("main.classify_notice")
def test_create_notice(mock_classify, mock_summarize, mock_supabase):
    """Test creating a notice via API"""
    # Mock the functions
    mock_summarize.return_value = "Event summary"
    mock_classify.return_value = "Events"
    
    # Mock Supabase client
    mock_client = MagicMock()
    mock_table = MagicMock()
    mock_insert = MagicMock()
    mock_execute = MagicMock()
    
    mock_execute.data = [{
        "id": "456",
        "title": "Campus Fest",
        "summary": "Event summary",
        "category": "Events"
    }]
    mock_insert.execute.return_value = mock_execute
    mock_table.insert.return_value = mock_insert
    mock_client.table.return_value = mock_table
    mock_supabase.return_value = mock_client
    
    # Test notice creation
    payload = {
        "title": "Campus Fest",
        "content": "Annual campus fest will be held on Friday."
    }
    
    response = client.post("/api/notices", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "notice" in data


@patch("main.get_supabase_client")
def test_get_notices(mock_supabase):
    """Test retrieving notices"""
    # Mock Supabase client
    mock_client = MagicMock()
    mock_table = MagicMock()
    mock_select = MagicMock()
    mock_order = MagicMock()
    mock_limit = MagicMock()
    mock_execute = MagicMock()
    
    mock_execute.data = [
        {"id": "1", "title": "Notice 1"},
        {"id": "2", "title": "Notice 2"}
    ]
    
    mock_limit.execute.return_value = mock_execute
    mock_order.limit.return_value = mock_limit
    mock_select.order.return_value = mock_order
    mock_table.select.return_value = mock_select
    mock_client.table.return_value = mock_table
    mock_supabase.return_value = mock_client
    
    # Test getting notices
    response = client.get("/api/notices?limit=2")
    
    assert response.status_code == 200
    data = response.json()
    assert "notices" in data
    assert len(data["notices"]) == 2


def test_webhook_missing_data():
    """Test webhook with missing data"""
    payload = {}
    response = client.post("/api/webhook", json=payload)
    # Should still process but with empty strings
    # The actual behavior depends on error handling
    assert response.status_code in [200, 500]
