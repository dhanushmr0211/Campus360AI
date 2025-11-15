import styles from "@/styles/NoticeCard.module.css";

// Function to extract first link from text
function extractLink(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

export default function NoticeCard({ notice }) {
  const link = extractLink(notice.original_content || "");

  return (
    <div className={styles.card}>
      <h3>{notice.title}</h3>
      <p className={styles.summary}>{notice.summary}</p>

      <p className={styles.category}>Category: {notice.category}</p>

      {/* Show Register Button if a link exists */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Register Now →
        </a>
      )}
    </div>
  );
}