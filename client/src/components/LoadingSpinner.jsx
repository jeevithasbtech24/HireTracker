export default function LoadingSpinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}