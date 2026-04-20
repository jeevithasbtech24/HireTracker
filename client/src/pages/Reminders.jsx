import { useState } from "react";

export default function Reminders({ user, onBack }) {
  const storageKey = `ht_reminders_${user.email}`;
  const [reminders, setReminders] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || "[]")
  );
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  const save = (updated) => {
    setReminders(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!text.trim() || !date) return;
    const newReminder = { id: Date.now(), text, date };
    save([newReminder, ...reminders]);
    setText("");
    setDate("");
  };

  const handleDelete = (id) => save(reminders.filter((r) => r.id !== id));

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Reminders</h1>
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #e2e8f0",
          padding: "8px 16px", borderRadius: "8px",
          cursor: "pointer", color: "#64748b", fontWeight: "600"
        }}>← Back</button>
      </div>

      <div className="job-card" style={{ maxWidth: "500px", marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>Add Reminder</h3>
        <input
          className="filter-search"
          style={{ width: "100%", marginBottom: "10px" }}
          placeholder="e.g. Follow up with Google recruiter"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="date"
          className="filter-search"
          style={{ width: "100%", marginBottom: "10px" }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn-add" onClick={handleAdd}>+ Add</button>
      </div>

      {reminders.length === 0 ? (
        <div className="empty-state">
          <h3>No reminders yet</h3>
          <p>Add reminders for follow-ups, interviews, or deadlines!</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {reminders.map((r) => (
            <div className="job-card" key={r.id}>
              <div className="job-title">{r.text}</div>
              <div className="job-date" style={{ marginTop: "8px" }}> {formatDate(r.date)}</div>
              <div className="job-actions" style={{ marginTop: "12px" }}>
                <button className="btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}