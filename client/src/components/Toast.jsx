import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === "success" ? "#22c55e" : "#ef4444";

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      backgroundColor: bg,
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "14px",
      zIndex: 9999,
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    }}>
      {type === "success" ? "✅ " : "❌ "}{message}
    </div>
  );
}