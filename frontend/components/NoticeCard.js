"use client";

import styles from "@/styles/NoticeCard.module.css";

export default function NoticeCard({ notice, view = "grid" }) {
  const { title, summary, category, created_at } = notice;

  // ---------------------------
  // 1) Detect Links
  // ---------------------------
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = summary?.match(urlRegex) || [];

  // ---------------------------
  // 2) Extract Venue & Timing
  // ---------------------------
  const venueMatch = summary?.match(/(Venue|Location)[:\-]\s*(.*?)(\.|$)/i);
  const timeMatch = summary?.match(/(Time|Timing)[:\-]\s*(.*?)(\.|$)/i);

  const venue = venueMatch?.[2]?.trim();
  const timing = timeMatch?.[2]?.trim();

  // ---------------------------
  // 3) Auto Category (fallback)
  // ---------------------------
  const detectCategory = () => {
    const text = (summary || "").toLowerCase();

    if (category) return category;

    if (text.includes("recruitment") || text.includes("team quest"))
      return "Recruitment";
    if (text.includes("cultural") || text.includes("fest")) return "Cultural";
    if (text.includes("event") || text.includes("session")) return "Event";
    if (text.includes("technical") || text.includes("workshop"))
      return "Technical";
    if (text.includes("match") || text.includes("sports")) return "Sports";
    if (text.includes("exam") || text.includes("internal"))
      return "Academic";

    return "General";
  };

  const finalCategory = detectCategory();

  // ---------------------------
  // 4) NEW Badge Logic
  // ---------------------------
  const isNew = () => {
    if (!created_at) return false;
    const hours =
      (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60);
    return hours < 24;
  };

  // ---------------------------
  // 5) Copy Link Feature
  // ---------------------------
  const copyLink = (url) => {
    if (!navigator?.clipboard) {
      alert("Clipboard not available");
      return;
    }
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <article
      className={`${styles.card} ${
        view === "list" ? styles.listCard : styles.gridCard
      }`}
    >
      {/* NEW Badge */}
      {isNew() && <span className={styles.newBadge}>NEW</span>}

      {/* Category */}
      <span
        className={`${styles.tag} ${
          styles[finalCategory.toLowerCase()] || styles.general
        }`}
      >
        {finalCategory}
      </span>

      <h2 className={styles.title}>{title}</h2>

      <p className={styles.summary}>{summary}</p>

      {/* Venue / Timing */}
      {(venue || timing) && (
        <div className={styles.infoBox}>
          {venue && (
            <p>
              <strong>📍 Venue:</strong> {venue}
            </p>
          )}
          {timing && (
            <p>
              <strong>⏰ Time:</strong> {timing}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      {links.length > 0 && (
        <div className={styles.buttonRow}>
          <a
            className={styles.openBtn}
            href={links[0]}
            target="_blank"
            rel="noreferrer"
          >
            Open Link
          </a>

          <button
            type="button"
            className={styles.copyBtn}
            onClick={() => copyLink(links[0])}
          >
            Copy Link
          </button>
        </div>
      )}

      {/* Footer meta */}
      <div className={styles.metaRow}>
        {created_at && (
          <span className={styles.metaText}>
            🕒 {new Date(created_at).toLocaleString()}
          </span>
        )}
      </div>
    </article>
  );
}
