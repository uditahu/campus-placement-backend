export default function Alert({ type = "info", message, onClose }) {
  if (!message) return null;
  const cls = {
    success: "alert-success",
    danger: "alert-danger",
    error: "alert-danger",
    info: "alert-info",
    warning: "alert-warning",
  }[type] || "alert-info";

  return (
    <div className={`alert ${cls}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>✕</button>
      )}
    </div>
  );
}
