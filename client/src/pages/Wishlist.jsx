import { useState } from "react";

export default function Wishlist({ user, onBack }) {
  const storageKey = `ht_wishlist_${user.email}`;
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || "[]")
  );
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");

  const save = (updated) => {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!title.trim() || !company.trim()) return;
    save([{ id: Date.now(), title, company, url }, ...items]);
    setTitle(""); setCompany(""); setUrl("");
  };

  const handleDelete = (id) => save(items.filter((i) => i.id !== id));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Wishlist </h1>
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #e2e8f0",
          padding: "8px 16px", borderRadius: "8px",
          cursor: "pointer", color: "#64748b", fontWeight: "600"
        }}>← Back</button>
      </div>

      <div className="job-card" style={{ maxWidth: "500px", marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>Save a Dream Job</h3>
        <input className="filter-search" style={{ width: "100%", marginBottom: "10px" }}
          placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="filter-search" style={{ width: "100%", marginBottom: "10px" }}
          placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input className="filter-search" style={{ width: "100%", marginBottom: "10px" }}
          placeholder="Job URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button className="btn-add" onClick={handleAdd}>+ Save Job</button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No wishlist jobs yet</h3>
          <p>Save jobs you want to apply to later!</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {items.map((item) => (
            <div className="job-card" key={item.id}>
              <div className="job-title">{item.title}</div>
              <div className="job-company">{item.company}</div>
              {item.url && (
                <div className="job-meta" style={{ marginTop: "8px" }}>
                  <a href={item.url} target="_blank" rel="noreferrer">🔗 View Job</a>
                </div>
              )}
              <div className="job-actions" style={{ marginTop: "12px" }}>
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}