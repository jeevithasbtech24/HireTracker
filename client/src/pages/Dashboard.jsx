import { useState, useEffect } from "react";
import AddJobForm from "../components/AddJobForm";
import EditJobForm from "../components/EditJobForm";

const BADGE_CLASS = {
  Applied: "badge-applied",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected",
  Saved: "badge-saved",
};

export default function Dashboard({ user }) {
  const storageKey = `ht_jobs_${user.email}`;

  const [jobs, setJobs] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  });
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(jobs));
  }, [jobs, storageKey]);

  const handleAdd = (job) => {
    setJobs([job, ...jobs]);
  };

  const handleSave = (updated) => {
    setJobs(jobs.map((j) => (j.id === updated.id ? updated : j)));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this application?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  const filtered = jobs
    .filter((j) => {
      const matchSearch =
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || j.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Applications</h1>
        <button className="btn-add" onClick={() => setShowAdd(true)}>
          + Add Job
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-num">{stats.applied}</div>
          <div className="stat-label">Applied</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-num">{stats.interview}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card green">
          <div className="stat-num">{stats.offer}</div>
          <div className="stat-label">Offers</div>
        </div>
        <div className="stat-card red">
          <div className="stat-num">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="filters">
        <input
          className="filter-search"
          type="text"
          placeholder="Search by job or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {["All", "Saved", "Applied", "Interview", "Offer", "Rejected"].map(
            (s) => (
              <option key={s}>{s}</option>
            )
          )}
        </select>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="company">Company A-Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>
            {jobs.length === 0
              ? "Click '+ Add Job' to track your first application!"
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="job-card-header">
                <div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-company">{job.company}</div>
                </div>
                <span className={`badge ${BADGE_CLASS[job.status] || "badge-applied"}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-meta">
                {job.location && <span> {job.location}</span>}
                {job.salary && <span> {job.salary}</span>}
                {job.url && (
                  <span>
                    <a href={job.url} target="_blank" rel="noreferrer">
                      🔗 Link
                    </a>
                  </span>
                )}
              </div>

              {job.notes && <div className="job-notes">{job.notes}</div>}

              <div className="job-date">Applied on {formatDate(job.date)}</div>

              <div className="job-actions">
                <button className="btn-edit" onClick={() => setEditJob(job)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddJobForm onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editJob && (
        <EditJobForm
          job={editJob}
          onSave={handleSave}
          onClose={() => setEditJob(null)}
        />
      )}
    </div>
  );
}