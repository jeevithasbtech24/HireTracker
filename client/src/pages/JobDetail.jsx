const BADGE_CLASS = {
  Applied: "badge-applied",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected",
  Saved: "badge-saved",
};

export default function JobDetail({ job, onBack, onEdit, onDelete }) {
  if (!job) return null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button onClick={onBack} style={{
          background: "none", border: "1px solid #e2e8f0",
          padding: "8px 16px", borderRadius: "8px",
          cursor: "pointer", color: "#64748b", fontWeight: "600"
        }}>
          ← Back
        </button>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-edit" onClick={() => onEdit(job)}>Edit</button>
          <button className="btn-delete" onClick={() => onDelete(job.id)}>Delete</button>
        </div>
      </div>

      <div className="job-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="job-card-header">
          <div>
            <div className="job-title">{job.title}</div>
            <div className="job-company">{job.company}</div>
          </div>
          <span className={`badge ${BADGE_CLASS[job.status] || "badge-applied"}`}>
            {job.status}
          </span>
        </div>

        <div className="job-meta" style={{ flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          {job.location && <span>Location: {job.location}</span>}
          {job.salary && <span>Salary: {job.salary}</span>}
          {job.date && <span>Applied on: {formatDate(job.date)}</span>}
          {job.url && (
            <span>🔗 Job Link: <a href={job.url} target="_blank" rel="noreferrer">{job.url}</a></span>
          )}
        </div>

        {job.notes && (
          <div style={{ marginTop: "16px" }}>
            <strong>Notes:</strong>
            <div className="job-notes" style={{ marginTop: "6px" }}>{job.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}