# classifier.py (NEW - OpenAI powered classifier)

from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def classify_notice(title: str, content: str) -> str:
    """
    AI-powered classifier to categorize college notices.
    Categories: Academic, Technical, Cultural, Sports, General
    """

    try:
        prompt = f"""
        Classify the following college notice into one category:
        Academic, Technical, Cultural, Sports, or General.

        Title: {title}
        Content: {content}

        Respond with only ONE category name.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=5
        )

        category = response.choices[0].message.content.strip()

        # Safety fallback
        valid = ["Academic", "Technical", "Cultural", "Sports", "General"]
        if category not in valid:
            return "General"

        return category

    except Exception as e:
        print("❌ Classification failed:", e)
        return "General"
