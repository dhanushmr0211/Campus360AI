export default function NoticeCard({ notice }) {
  const badgeClass = {
    Academic: "badge badge-academic",
    Technical: "badge badge-technical",
    Cultural: "badge badge-cultural",
    Sports: "badge badge-sports",
    General: "badge badge-general",
  }[notice.category] || "badge badge-general";

  return (
    <div className="card">
      <div className="title">{notice.title}</div>

      <div className="summary">{notice.summary}</div>

      <div className={badgeClass}>{notice.category}</div>

      <div className="timestamp">
        {new Date(notice.created_at).toLocaleString()}
      </div>
    </div>
  );
}
