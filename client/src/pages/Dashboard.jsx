import { useState, useEffect } from "react";
import AddJobForm from "../components/AddJobForm";
import EditJobForm from "../components/EditJobForm";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getJobs, addJob, updateJob, deleteJob } from "../services/api";

const BADGE_CLASS = {
  Applied: "badge-applied",
  Interview: "badge-interview",
  Offer: "badge-offer",
  Rejected: "badge-rejected",
  Saved: "badge-saved",
};

const PIE_COLORS = ["#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa"];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

export default function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(null);
  const [generatingEmailDraft, setGeneratingEmailDraft] = useState(null);

  // Load jobs from backend on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        if (Array.isArray(data)) {
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleAdd = async (job) => {
    try {
      const newJob = await addJob(job);
      setJobs([newJob, ...jobs]);
    } catch (err) {
      console.error("Failed to add job:", err);
    }
  };

  const handleSave = async (updated) => {
    try {
      const savedJob = await updateJob(updated._id, updated);
      setJobs(jobs.map((j) => (j._id === savedJob._id ? savedJob : j)));
    } catch (err) {
      console.error("Failed to update job:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this application?")) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter((j) => j._id !== id));
      } catch (err) {
        console.error("Failed to delete job:", err);
      }
    }
  };

  const handleGenerateCoverLetter = async (job) => {
    const storedUser = JSON.parse(localStorage.getItem("ht_user") || "{}");
    const bio = storedUser.bio || "";
    const userName = storedUser.name || "Applicant";

    if (!bio) {
      alert("Please add your bio in Profile → About Me first!");
      return;
    }

    setGeneratingCoverLetter(job._id);

    try {
      const prompt = `Write a professional cover letter for the following job application:

Job Title: ${job.title}
Company: ${job.company}
${job.location ? `Location: ${job.location}` : ""}
${job.salary ? `Salary: ${job.salary}` : ""}
${job.notes ? `Additional Notes: ${job.notes}` : ""}

Applicant Name: ${userName}
About the Applicant: ${bio}

Instructions:
- Write 3 clear paragraphs
- Start directly with "Dear Hiring Manager,"
- Paragraph 1: Express interest in the role and company
- Paragraph 2: Highlight relevant skills and experience from the bio
- Paragraph 3: Close with enthusiasm and call to action
- End with: "Sincerely,\n${userName}"
- Do NOT include placeholders like [Your Address] or [Date]
- Keep it under 300 words, professional and confident`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "Gemini API error");

      const letterText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate cover letter.";

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setTextColor(15, 15, 15);
      doc.setFont("helvetica", "bold");
      doc.text("Cover Letter", 14, 20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`${job.title} at ${job.company}`, 14, 30);
      doc.text(`Prepared by: ${userName}  |  ${new Date().toLocaleDateString("en-GB")}`, 14, 38);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 43, 196, 43);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(letterText, 178);
      doc.text(lines, 14, 54);
      const fileName = `CoverLetter_${job.company}_${job.title}`.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_");
      doc.save(`${fileName}.pdf`);

    } catch (err) {
      alert(`Failed to generate cover letter.\n\nError: ${err.message}`);
    } finally {
      setGeneratingCoverLetter(null);
    }
  };

  const handleGenerateEmailDraft = async (job) => {
    const storedUser = JSON.parse(localStorage.getItem("ht_user") || "{}");
    const userName = storedUser.name || "Applicant";
    const bio = storedUser.bio || "";

    setGeneratingEmailDraft(job._id);

    try {
      const prompt = `Write a short professional follow-up email to a recruiter for the following job:

Job Title: ${job.title}
Company: ${job.company}
${job.location ? `Location: ${job.location}` : ""}
Applicant Name: ${userName}
${bio ? `About the Applicant: ${bio}` : ""}

Instructions:
- First line must be: Subject: Following Up – ${job.title} Application at ${job.company}
- Then write the email body
- Keep it under 150 words
- Professional, confident, and polite tone
- End with applicant name: ${userName}
- Do NOT include placeholders like [Your Phone] or [Date]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "Gemini API error");

      const emailText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate email draft.";

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 15, 15);
      doc.text("Email Draft", 14, 20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`${job.title} at ${job.company}`, 14, 30);
      doc.text(`Prepared by: ${userName}  |  ${new Date().toLocaleDateString("en-GB")}`, 14, 38);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 43, 196, 43);
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(emailText, 178);
      doc.text(lines, 14, 54);
      const fileName = `EmailDraft_${job.company}_${job.title}`.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_");
      doc.save(`${fileName}.pdf`);

    } catch (err) {
      alert(`Failed to generate email draft.\n\nError: ${err.message}`);
    } finally {
      setGeneratingEmailDraft(null);
    }
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("HireTracker - My Job Applications", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-GB")} | ${user.name}`, 14, 30);
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total: ${stats.total}  |  Applied: ${stats.applied}  |  Interviews: ${stats.interview}  |  Offers: ${stats.offer}  |  Rejected: ${stats.rejected}`, 14, 42);
    autoTable(doc, {
      startY: 50,
      head: [["Job Title", "Company", "Location", "Salary", "Status", "Date"]],
      body: jobs.map((j) => [
        j.title || "-",
        j.company || "-",
        j.location || "-",
        j.salary || "-",
        j.status || "-",
        new Date(j.appliedAt || j.createdAt).toLocaleDateString("en-GB"),
      ]),
      headStyles: { fillColor: [15, 15, 15], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 250] },
      styles: { fontSize: 10, cellPadding: 4 },
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
      if (sortBy === "newest") return new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt);
      if (sortBy === "oldest") return new Date(a.appliedAt || a.createdAt) - new Date(b.appliedAt || b.createdAt);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0;
    });

  const pieData = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
    { name: "Saved", value: jobs.filter((j) => j.status === "Saved").length },
  ].filter((d) => d.value > 0);

  const monthMap = {};
  jobs.forEach((j) => {
    const d = new Date(j.appliedAt || j.createdAt);
    const month = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });
  const barData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });

  const getCountdown = (job) => {
    if (job.status !== "Interview" || !job.appliedAt) return null;
    const diff = Math.ceil(
      (new Date(job.appliedAt) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Interview is Today!";
    if (diff > 0) return `Interview in ${diff} day(s)`;
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="empty-state">
          <h3>Loading your applications...</h3>
        </div>
      </div>
    );
  }

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
              Export PDF
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
              Application Breakdown
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
              Applications per Month
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
              <div className="job-card" key={job._id}>
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
                <div className="job-date">Applied on {formatDate(job.appliedAt || job.createdAt)}</div>

                <div className="job-actions" style={{ flexWrap: "wrap", gap: "0.4rem" }}>
                  <button className="btn-edit" onClick={() => setEditJob(job)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(job._id)}>Delete</button>
                  <button
                    onClick={() => handleGenerateCoverLetter(job)}
                    disabled={generatingCoverLetter === job._id}
                    style={{
                      background: generatingCoverLetter === job._id ? "#5b21b6" : "#7c3aed",
                      color: "white", border: "none", padding: "7px 13px",
                      borderRadius: "7px", fontSize: "0.78rem", fontWeight: "600",
                      cursor: generatingCoverLetter === job._id ? "not-allowed" : "pointer",
                      opacity: generatingCoverLetter === job._id ? 0.75 : 1,
                      transition: "all 0.2s", whiteSpace: "nowrap",
                    }}
                  >
                    {generatingCoverLetter === job._id ? "⏳ Generating..." : "✉️ Cover Letter"}
                  </button>
                  <button
                    onClick={() => handleGenerateEmailDraft(job)}
                    disabled={generatingEmailDraft === job._id}
                    style={{
                      background: generatingEmailDraft === job._id ? "#065f46" : "#059669",
                      color: "white", border: "none", padding: "7px 13px",
                      borderRadius: "7px", fontSize: "0.78rem", fontWeight: "600",
                      cursor: generatingEmailDraft === job._id ? "not-allowed" : "pointer",
                      opacity: generatingEmailDraft === job._id ? 0.75 : 1,
                      transition: "all 0.2s", whiteSpace: "nowrap",
                    }}
                  >
                    {generatingEmailDraft === job._id ? "⏳ Generating..." : "📧 Email Draft"}
                  </button>
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