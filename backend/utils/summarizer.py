from transformers import pipeline

# Load the model once (Correction: global caching)
summarizer = pipeline("summarization", model="t5-small")

def summarize_text(text: str) -> str:
    """Summarize long text or return short text as-is."""
    try:
        # If the message is short, no need to summarize
        if len(text.split()) < 10:
            return text

        result = summarizer(
            text,
            max_length=60,
            min_length=15,
            do_sample=False
        )
        return result[0]["summary_text"]

    except Exception as e:
        print("❌ Summarization failed:", e)
        return text[:150]  # fallback summary
