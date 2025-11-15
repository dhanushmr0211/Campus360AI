export default function NoticeCard({ notice }) {
  const categoryColors = {
    Academic: "#4A90E2",
    Technical: "#50E3C2",
    Cultural: "#F5A623",
    Sports: "#B8E986",
    General: "#D8D8D8",
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "14px",
      background: "#fff",
      marginBottom: "18px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      borderLeft: `6px solid ${categoryColors[notice.category] || "#ccc"}`,
      animation: "fadeIn 0.4s ease"
    }}>
      <h2>{notice.summary}</h2>
      <p style={{ color: "#666" }}>{notice.original_content}</p>

      <div style={{ marginTop: "12px", fontSize: "13px", color: "#999" }}>
        Category: {notice.category}
      </div>
      <div style={{ fontSize: "12px", color: "#aaa" }}>
        {new Date(notice.created_at).toLocaleString()}
      </div>
    </div>
  );
}
