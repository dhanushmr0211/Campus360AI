import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text(text: str) -> str:
    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=f"Summarize this notice in 20-30 words:\n\n{text}"
        )
        return response.output[0].content[0].text
    except:
        return text[:150]  # fallback
