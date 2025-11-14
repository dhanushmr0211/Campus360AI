# summarizer.py  (NEW - using OpenAI API)
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text(text: str) -> str:
    try:
        prompt = f"""
        Summarize the following announcement in simple, short college student-friendly language.
        Keep it under 2 lines.

        Announcement:
        {text}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=60
        )

        summary = response.choices[0].message.content.strip()
        return summary

    except Exception as e:
        print("❌ Summarization failed:", e)
        return text[:150]  # fallback
