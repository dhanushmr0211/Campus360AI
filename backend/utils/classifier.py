def classify_notice(title: str, content: str) -> str:
    """Simple rule-based classifier to determine notice category."""
    text = (title + " " + content).lower()

    if any(word in text for word in ["exam", "result", "class", "assignment", "internal", "lab"]):
        return "Academic"

    if any(word in text for word in ["hackathon", "coding", "project", "programming", "AI", "ml", "cloud"]):
        return "Technical"

    if any(word in text for word in ["fest", "dance", "music", "cultural", "freshers", "event"]):
        return "Cultural"

    if any(word in text for word in ["match", "tournament", "football", "cricket", "sports"]):
        return "Sports"

    return "General"
