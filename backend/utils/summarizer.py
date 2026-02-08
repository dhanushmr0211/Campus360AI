import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_text(text: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Summarize the notice in 2 short meaningful lines."},
                {"role": "user", "content": text}
            ],
            temperature=0.4,
            max_tokens=80
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("Summarization Error:", e)
        return text[:120]   # fallback
