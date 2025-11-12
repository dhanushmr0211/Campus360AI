"""
Notice classification utilities
"""
import os
from typing import Optional
import re


CATEGORIES = [
    "Academic",
    "Events",
    "Sports",
    "Clubs",
    "Administration",
    "Placement",
    "Workshop",
    "Scholarship",
    "General",
]


def classify_notice(title: str, content: str) -> str:
    """
    Classify the notice into predefined categories.
    
    Args:
        title: Notice title
        content: Notice content
        
    Returns:
        Category string
    """
    text = f"{title} {content}".lower()
    
    # Try AI classification first
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            return _classify_with_openai(title, content)
        except Exception as e:
            print(f"AI classification failed: {e}")
    
    # Fallback to keyword-based classification
    return _keyword_classify(text)


def _classify_with_openai(title: str, content: str) -> str:
    """Classify using OpenAI GPT models"""
    from openai import OpenAI
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    categories_str = ", ".join(CATEGORIES)
    prompt = f"""Classify the following notice into one of these categories: {categories_str}
    
Title: {title}
Content: {content}

Respond with only the category name."""
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a classifier that categorizes campus notices."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=20,
        temperature=0.1
    )
    
    category = response.choices[0].message.content.strip()
    
    # Validate that the response is in our categories
    if category in CATEGORIES:
        return category
    
    # Fallback to keyword classification
    return _keyword_classify(f"{title} {content}".lower())


def _keyword_classify(text: str) -> str:
    """
    Keyword-based classification fallback.
    
    Args:
        text: Lowercased text to classify
        
    Returns:
        Category string
    """
    # Define keyword patterns for each category
    patterns = {
        "Academic": r"(exam|test|grade|course|class|lecture|assignment|syllabus|semester|academic)",
        "Events": r"(event|fest|celebration|ceremony|function|gathering|meet)",
        "Sports": r"(sport|match|game|tournament|cricket|football|basketball|athletics)",
        "Clubs": r"(club|society|team|group|association|committee)",
        "Administration": r"(fee|registration|admission|office|administration|circular|notice|policy)",
        "Placement": r"(placement|job|internship|career|company|recruit|interview)",
        "Workshop": r"(workshop|seminar|training|webinar|session|tutorial)",
        "Scholarship": r"(scholarship|financial aid|grant|fellowship|award)",
    }
    
    # Count matches for each category
    scores = {}
    for category, pattern in patterns.items():
        matches = len(re.findall(pattern, text))
        if matches > 0:
            scores[category] = matches
    
    # Return category with highest score
    if scores:
        return max(scores, key=scores.get)
    
    # Default category
    return "General"
