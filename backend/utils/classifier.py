def classify_notice(title: str, content: str) -> str:
    text = (title + " " + content).lower()

    if any(w in text for w in ["exam", "result", "class", "assignment", "internal", "lab"]):
        return "Academic"

    if any(w in text for w in ["hackathon", "coding", "programming", "project", "ai", "ml", "cloud"]):
        return "Technical"

    if any(w in text for w in ["fest", "dance", "music", "cultural", "freshers", "event"]):
        return "Cultural"

    if any(w in text for w in ["match", "tournament", "football", "cricket", "sports"]):
        return "Sports"

    return "General"
