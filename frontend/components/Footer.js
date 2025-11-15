export default function Footer() {
  return (
    <footer style={{
      width: "100%",
      padding: "20px 0",
      textAlign: "center",
      background: "#f0f0f5",
      marginTop: "40px",
      borderTop: "1px solid #ddd",
      fontSize: "14px",
      color: "#555"
    }}>
      <p>© {new Date().getFullYear()} Campus360 AI • Built by Dhanush</p>
      <p style={{ marginTop: "5px" }}>
        Powered by Supabase • FastAPI • OpenAI • Next.js
      </p>
    </footer>
  );
}
