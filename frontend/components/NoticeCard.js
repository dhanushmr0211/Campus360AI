export default function NoticeCard({ notice }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm mb-4 bg-white">
      <h2 className="text-lg font-semibold">{notice.title}</h2>

      <p className="text-gray-700 mt-2">{notice.summary}</p>

      <p className="text-sm text-blue-600 mt-2">
        Category: {notice.category}
      </p>

      <p className="text-xs text-gray-400 mt-2">
        {new Date(notice.created_at).toLocaleString()}
      </p>
    </div>
  );
}
