export default function NotFound({ onBack }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "60vh", textAlign: "center", padding: "40px"
    }}>
      <div style={{ fontSize: "80px" }}></div>
      <h1 style={{ fontSize: "48px", color: "#6366f1", margin: "16px 0 8px" }}>404</h1>
      <h2 style={{ color: "#1e293b", marginBottom: "8px" }}>Page Not Found</h2>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        Looks like this page doesn't exist!
      </p>
      <button onClick={onBack} style={{
        background: "#6366f1", color: "white",
        border: "none", padding: "12px 28px",
        borderRadius: "8px", cursor: "pointer",
        fontWeight: "600", fontSize: "15px"
      }}>
        Go to Dashboard
      </button>
    </div>
  );
}