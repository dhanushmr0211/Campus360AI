import styles from "@/styles/NoticeCard.module.css";

export default function NoticeCard({ notice }) {
  return (
    <div className={styles.card}>
      <h3>{notice.title}</h3>
      <p>{notice.summary}</p>
      <span className={styles.category}>{notice.category}</span>

      {notice.link && (
        <a
          href={notice.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkBtn}
        >
          Open Link
        </a>
      )}
    </div>
  );
}
