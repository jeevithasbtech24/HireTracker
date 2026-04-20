export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "white", borderRadius: "12px",
        padding: "32px", maxWidth: "380px", width: "90%",
        textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
      }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗑️</div>
        <h3 style={{ marginBottom: "8px", color: "#1e293b" }}>Are you sure?</h3>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>{message}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "10px 24px", borderRadius: "8px",
            border: "1px solid #e2e8f0", background: "white",
            cursor: "pointer", fontWeight: "600", color: "#64748b"
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            padding: "10px 24px", borderRadius: "8px",
            border: "none", background: "#ef4444",
            cursor: "pointer", fontWeight: "600", color: "white"
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}