import styles from "@/styles/NoticeCard.module.css";

export default function NoticeCard({ notice }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const foundLinks = notice.original_content.match(urlRegex);

  return (
    <div className={styles.card}>
      <p className={styles.category}>{notice.category}</p>
      <h3 className={styles.title}>{notice.title}</h3>

      <p className={styles.summary}>{notice.summary}</p>

      <p className={styles.date}>
        {new Date(notice.created_at).toLocaleString()}
      </p>

      {foundLinks && (
        <a
          href={foundLinks[0]}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Register Now
        </a>
      )}
    </div>
  );
}
