"""
Text summarization utilities using AI models
"""
import os
from typing import Optional

def summarize_text(text: str, max_length: int = 150) -> str:
    """
    Summarize the given text using AI models.
    
    Args:
        text: The text to summarize
        max_length: Maximum length of the summary
        
    Returns:
        Summarized text
    """
    if not text:
        return ""
    
    # Try OpenAI first if API key is available
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            return _summarize_with_openai(text, max_length)
        except Exception as e:
            print(f"OpenAI summarization failed: {e}")
    
    # Try Anthropic if OpenAI fails
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    if anthropic_key:
        try:
            return _summarize_with_anthropic(text, max_length)
        except Exception as e:
            print(f"Anthropic summarization failed: {e}")
    
    # Fallback to simple extraction
    return _simple_summarize(text, max_length)


def _summarize_with_openai(text: str, max_length: int) -> str:
    """Summarize using OpenAI GPT models"""
    from openai import OpenAI
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes campus notices concisely."},
            {"role": "user", "content": f"Summarize this notice in {max_length} characters or less:\n\n{text}"}
        ],
        max_tokens=100,
        temperature=0.3
    )
    
    return response.choices[0].message.content.strip()


def _summarize_with_anthropic(text: str, max_length: int) -> str:
    """Summarize using Anthropic Claude models"""
    from anthropic import Anthropic
    
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=100,
        messages=[
            {"role": "user", "content": f"Summarize this notice in {max_length} characters or less:\n\n{text}"}
        ]
    )
    
    return message.content[0].text.strip()


def _simple_summarize(text: str, max_length: int) -> str:
    """
    Simple fallback summarization by extracting key sentences.
    Uses the first few sentences up to max_length.
    """
    if len(text) <= max_length:
        return text
    
    # Split into sentences
    sentences = text.replace('!', '.').replace('?', '.').split('.')
    
    summary = ""
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        if len(summary) + len(sentence) + 2 <= max_length:
            summary += sentence + ". "
        else:
            break
    
    if not summary:
        # If no complete sentence fits, just truncate
        summary = text[:max_length - 3] + "..."
    
    return summary.strip()
