import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

export default function WeeklyReport({ user, onBack }) {
  const [jobs, setJobs] = useState([]);
  const [weekStats, setWeekStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const storageKey = `ht_jobs_${user.email}`;
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setJobs(stored);
  }, [user]);

  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
  };

  const computeStats = () => {
    const { monday, sunday } = getWeekRange();

    const weekJobs = jobs.filter((j) => {
      const d = new Date(j.date);
      return d >= monday && d <= sunday;
    });

    const stats = {
      total: weekJobs.length,
      applied: weekJobs.filter((j) => j.status === "Applied").length,
      interview: weekJobs.filter((j) => j.status === "Interview").length,
      offer: weekJobs.filter((j) => j.status === "Offer").length,
      rejected: weekJobs.filter((j) => j.status === "Rejected").length,
      saved: weekJobs.filter((j) => j.status === "Saved").length,
    };

    // Daily breakdown Mon-Sun
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daily = days.map((day, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const count = weekJobs.filter((j) => {
        const d = new Date(j.date);
        return d.toDateString() === date.toDateString();
      }).length;
      return { day, count };
    });

    return { stats, daily, weekJobs, monday, sunday };
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(false);
    setAiInsight("");

    const { stats, daily, weekJobs, monday, sunday } = computeStats();
    setWeekStats({ ...stats, monday, sunday });
    setDailyData(daily);

    try {
      const allTimeTotal = jobs.length;
      const allTimeApplied = jobs.filter((j) => j.status === "Applied").length;
      const allTimeInterview = jobs.filter((j) => j.status === "Interview").length;
      const allTimeOffer = jobs.filter((j) => j.status === "Offer").length;
      const allTimeRejected = jobs.filter((j) => j.status === "Rejected").length;

      const prompt = `You are a career coach. Give a short motivating and actionable insight to a job seeker.

Week: ${monday.toLocaleDateString("en-GB")} to ${sunday.toLocaleDateString("en-GB")}

This week: ${weekJobs.length === 0 ? "No applications added this week." : weekJobs.map((j) => `${j.title} at ${j.company} (${j.status})`).join(", ")}

All-time stats: ${allTimeTotal} total, ${allTimeApplied} applied, ${allTimeInterview} interviews, ${allTimeOffer} offers, ${allTimeRejected} rejected.

Instructions:
- Write 2-3 short paragraphs
- If no activity this week, encourage them to keep going and give tips
- If there is activity, comment on it and give specific advice
- Keep it under 150 words
- Write naturally, no bullet points`;

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
      if (data.error) throw new Error(data.error.message);

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate insight.";

      setAiInsight(text);
      setGenerated(true);
    } catch (err) {
      console.error(err);
      setAiInsight("Failed to generate AI insight. Please try again.");
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  const { monday, sunday } = getWeekRange();
  const weekLabel = `${monday.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>📊 Weekly Report</h1>
          <p style={{ fontSize: "0.88rem", color: "#71717a", marginTop: "4px" }}>
            {weekLabel}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.7rem" }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1.5px solid #e4e4e7",
              color: "#3f3f46",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "0.88rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              background: loading ? "#5b21b6" : "#7c3aed",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              transition: "all 0.2s",
            }}
          >
            {loading ? "⏳ Generating..." : "✨ Generate Report"}
          </button>
        </div>
      </div>

      {/* Empty state before generate */}
      {!generated && !loading && (
        <div className="empty-state" style={{ marginTop: "4rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3>Ready to see your weekly progress?</h3>
          <p>Click "Generate Report" to get your stats and AI insight for this week.</p>
        </div>
      )}

      {/* Results */}
      {generated && weekStats && (
        <>
          {/* Stat Cards */}
          <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="stat-card">
              <div className="stat-num">{weekStats.total}</div>
              <div className="stat-label">This Week</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-num">{weekStats.applied}</div>
              <div className="stat-label">Applied</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-num">{weekStats.interview}</div>
              <div className="stat-label">Interviews</div>
            </div>
            <div className="stat-card green">
              <div className="stat-num">{weekStats.offer}</div>
              <div className="stat-label">Offers</div>
            </div>
            <div className="stat-card red">
              <div className="stat-num">{weekStats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {/* Daily Bar Chart */}
          <div className="stat-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "1rem" }}>
              📅 Daily Activity This Week
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#71717a" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    color: "#0f0f0f",
                  }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insight */}
          <div
            className="stat-card"
            style={{
              padding: "1.5rem",
              marginBottom: "2rem",
              borderLeft: "4px solid #7c3aed",
              background: "#faf5ff",
            }}
          >
            <h3 style={{ fontWeight: "700", marginBottom: "0.8rem", fontSize: "0.95rem", color: "#7c3aed" }}>
              🤖 AI Career Coach Insight
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#3f3f46", lineHeight: "1.7", whiteSpace: "pre-line" }}>
              {aiInsight}
            </p>
          </div>

          {/* No activity message */}
          {weekStats.total === 0 && (
            <div
              className="stat-card"
              style={{
                padding: "1.5rem",
                textAlign: "center",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #fbbf24",
                background: "#fffbeb",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "#92400e", fontWeight: "600" }}>
                ⚠️ No applications added this week. Start applying to see your weekly stats!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}