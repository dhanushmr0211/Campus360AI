import os
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

def summarize_text(text: str) -> str:
    """Summarize text using OpenAI API"""
    try:
        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            print("❌ OPENAI_API_KEY is missing")
            return text[:150]

        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model="gpt-4o-mini",
            input=f"Summarize this notice in 25 words:\n{text}"
        )

        return response.output[0].content[0].text

    except Exception as e:
        print("❌ OpenAI Error:", e)
        return text[:150]
