import { useState } from "react";
 
const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
 
export default function EditJobForm({ job, onSave, onClose }) {
  const [form, setForm] = useState({ ...job });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };
 
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Salary / Package</label>
            <input
              type="text"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Job URL</label>
            <input
              type="url"
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
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

