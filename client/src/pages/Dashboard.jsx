import { useState, useEffect } from "react";
import AddJobForm from "../components/AddJobForm";
import EditJobForm from "../components/EditJobForm";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BADGE_CLASS = {
  Applied: "badge-applied",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected",
  Saved: "badge-saved",
};

const PIE_COLORS = ["#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa"];

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

  const handleAdd = (job) => setJobs([job, ...jobs]);

  const handleSave = (updated) =>
    setJobs(jobs.map((j) => (j.id === updated.id ? updated : j)));

  const handleDelete = (id) => {
    if (window.confirm("Delete this application?"))
      setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("HireTracker - My Job Applications", 14, 20);

    // Subtitle
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")} | ${user.name}`, 14, 30);

    // Stats summary
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total: ${stats.total}  |  Applied: ${stats.applied}  |  Interviews: ${stats.interview}  |  Offers: ${stats.offer}  |  Rejected: ${stats.rejected}`, 14, 42);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [["Job Title", "Company", "Location", "Salary", "Status", "Date"]],
      body: jobs.map((j) => [
        j.title || "-",
        j.company || "-",
        j.location || "-",
        j.salary || "-",
        j.status || "-",
        new Date(j.date).toLocaleDateString("en-IN"),
      ]),
      headStyles: {
        fillColor: [15, 15, 15],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 250],
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
    });

    doc.save("HireTracker_Applications.pdf");
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

  const pieData = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
    { name: "Saved", value: jobs.filter((j) => j.status === "Saved").length },
  ].filter((d) => d.value > 0);

  const monthMap = {};
  jobs.forEach((j) => {
    const month = new Date(j.date).toLocaleDateString("en-IN", {
      month: "short", year: "2-digit",
    });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });
  const barData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  const getCountdown = (job) => {
    if (job.status !== "Interview" || !job.date) return null;
    const diff = Math.ceil(
      (new Date(job.date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Interview is Today!";
    if (diff > 0) return `Interview in ${diff} day(s)`;
    return null;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Applications</h1>
        <div style={{ display: "flex", gap: "0.7rem" }}>
          {jobs.length > 0 && (
            <button
              onClick={handleExportPDF}
              style={{
                background: "none",
                border: "1.5px solid #a78bfa",
                color: "#a78bfa",
                padding: "10px 18px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#a78bfa";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "none";
                e.target.style.color = "#a78bfa";
              }}
            >
              📄 Export PDF
            </button>
          )}
          <button className="btn-add" onClick={() => setShowAdd(true)}>
            + Add Job
          </button>
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Charts */}
      {jobs.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginBottom: "1.8rem",
        }}>
          <div className="stat-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "1rem", color: "inherit" }}>
              📊 Application Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f1f5f9" }} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: "0.8rem" }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="stat-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "1rem", color: "inherit" }}>
              📅 Applications per Month
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f1f5f9" }} />
                <Bar dataKey="count" fill="#a78bfa" radius={[6, 6, 0, 0]} name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          className="filter-search"
          type="text"
          placeholder="Search by job or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          {["All", "Saved", "Applied", "Interview", "Offer", "Rejected"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="company">Company A-Z</option>
        </select>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>{jobs.length === 0 ? "Click '+ Add Job' to track your first application!" : "Try adjusting your search or filter."}</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map((job) => {
            const countdown = getCountdown(job);
            return (
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

                {countdown && (
                  <div style={{
                    fontSize: "0.8rem", fontWeight: "700",
                    color: "#fbbf24", marginBottom: "8px",
                    background: "rgba(251,191,36,0.1)",
                    padding: "4px 10px", borderRadius: "6px",
                    display: "inline-block",
                  }}>
                    {countdown}
                  </div>
                )}

                <div className="job-meta">
                  {job.location && <span>📍 {job.location}</span>}
                  {job.salary && <span>💰 {job.salary}</span>}
                  {job.url && <span><a href={job.url} target="_blank" rel="noreferrer">🔗 Link</a></span>}
                </div>

                {job.notes && <div className="job-notes">{job.notes}</div>}
                <div className="job-date">Applied on {formatDate(job.date)}</div>

                <div className="job-actions">
                  <button className="btn-edit" onClick={() => setEditJob(job)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddJobForm onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {editJob && <EditJobForm job={editJob} onSave={handleSave} onClose={() => setEditJob(null)} />}
    </div>
  );
}