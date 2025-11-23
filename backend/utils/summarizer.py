import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def summarize_text(text: str) -> str:
    """
    Smart structured summarizer for campus announcements.
    Extracts summary, venue, timing, link, and category.
    """

    try:
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            print("❌ OPENAI_API_KEY is missing")
            return text[:150]

        client = OpenAI(api_key=api_key)

        prompt = f"""
You are an AI that summarizes college announcements into structured format.
From the announcement, extract the following fields clearly:

1. Summary (2–3 meaningful sentences)
2. Venue (physical location if mentioned)
3. Timing (date, time, schedule)
4. Registration Link (first valid link if any)
5. Category (choose ONE: Recruitment, Event, Cultural, Technical, Sports, Academic, General)

Your response MUST follow this exact template:

Summary: <summary>
Venue: <venue or "Not mentioned">
Timing: <timing or "Not mentioned">
Registration Link: <link or "None">
Category: <one category only>

Announcement:
{text}
"""

        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt
        )

        return response.output[0].content[0].text.strip()

    except Exception as e:
        print("❌ OpenAI Error:", e)
        return text[:150]
