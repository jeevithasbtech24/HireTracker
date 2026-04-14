import { useState } from "react";

const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export default function AddJobForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    status: "Applied",
    notes: "",
    url: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...form,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              placeholder="e.g. Google"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, Remote"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Salary / Package</label>
            <input
              type="text"
              placeholder="e.g. 12 LPA"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Job URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Any notes about this application..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}