export default function Navbar() {
  return (
    <nav style={{
      width: "100%",
      padding: "14px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backdropFilter: "blur(12px)",
      background: "rgba(255, 255, 255, 0.2)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
      position: "sticky",
      top: 0,
      zIndex: 20
    }}>
      <h1 style={{ fontSize: "22px", fontWeight: 600 }}>Campus360 AI</h1>
      <span style={{ fontSize: "14px" }}>Smart Notice Assistant</span>
    </nav>
  );
}
