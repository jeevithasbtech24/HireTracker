import { useState } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

export default function ResumeScore({ user, onBack }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
      setResult(null);
    } else {
      setError("Please upload a PDF file only.");
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const base64 = await toBase64(file);

      const prompt = `You are a professional resume reviewer. Analyze this resume and respond ONLY in the following JSON format, no extra text:

{
  "score": <number out of 100>,
  "grade": "<A / B / C / D>",
  "summary": "<2 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "sections": {
    "contact": <score out of 10>,
    "experience": <score out of 10>,
    "skills": <score out of 10>,
    "education": <score out of 10>,
    "formatting": <score out of 10>
  },
  "tip": "<one actionable tip to improve the resume>"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: "application/pdf",
                      data: base64,
                    },
                  },
                  { text: prompt },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "Gemini API error");

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(`Failed to analyze resume. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#d97706";
    return "#dc2626";
  };

  const getGradeColor = (grade) => {
    if (grade === "A") return "#16a34a";
    if (grade === "B") return "#2563eb";
    if (grade === "C") return "#d97706";
    return "#dc2626";
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Resume Score</h1>
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
      </div>

      {/* Upload Card */}
      <div
        className="stat-card"
        style={{ padding: "2rem", marginBottom: "1.5rem", maxWidth: "600px" }}
      >
        <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          Upload Your Resume
        </h2>
        <p style={{ fontSize: "0.88rem", color: "#71717a", marginBottom: "1.5rem" }}>
          Upload your resume as a PDF and get an AI-powered score with detailed feedback.
        </p>

        <div
          style={{
            border: "2px dashed #e4e4e7",
            borderRadius: "12px",
            padding: "2rem",
            textAlign: "center",
            marginBottom: "1rem",
            background: "#fafafa",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("resume-upload").click()}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📎</div>
          <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#3f3f46" }}>
            {file ? ` ${file.name}` : "Click to upload PDF"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#a1a1aa", marginTop: "4px" }}>
            PDF files only
          </div>
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {error && (
          <div className="error-msg" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#5b21b6" : "#967bc9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: loading || !file ? "not-allowed" : "pointer",
            opacity: !file ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div style={{ maxWidth: "700px" }}>
          {/* Score + Grade */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="stat-card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  color: getScoreColor(result.score),
                }}
              >
                {result.score}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#71717a", fontWeight: "600" }}>
                Score out of 100
              </div>
            </div>
            <div className="stat-card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  color: getGradeColor(result.grade),
                }}
              >
                {result.grade}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#71717a", fontWeight: "600" }}>
                Grade
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="stat-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "700", marginBottom: "0.6rem", fontSize: "0.95rem" }}>
              Summary
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#3f3f46", lineHeight: "1.6" }}>
              {result.summary}
            </p>
          </div>

          {/* Section Scores */}
          <div className="stat-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "700", marginBottom: "1rem", fontSize: "0.95rem" }}>
              Section Breakdown
            </h3>
            {Object.entries(result.sections).map(([key, val]) => (
              <div key={key} style={{ marginBottom: "0.8rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    textTransform: "capitalize",
                    color: "#3f3f46",
                  }}
                >
                  <span>{key}</span>
                  <span style={{ color: getScoreColor(val * 10) }}>{val}/10</span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "#f4f4f5",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${val * 10}%`,
                      background: getScoreColor(val * 10),
                      borderRadius: "99px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="stat-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "0.8rem", fontSize: "0.95rem", color: "#16a34a" }}>
                Strengths
              </h3>
              {result.strengths.map((s, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "0.85rem",
                    color: "#3f3f46",
                    padding: "6px 0",
                    borderBottom: i < result.strengths.length - 1 ? "1px solid #f4f4f5" : "none",
                  }}
                >
                  • {s}
                </div>
              ))}
            </div>
            <div className="stat-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "0.8rem", fontSize: "0.95rem", color: "#dc2626" }}>
                 Improvements
              </h3>
              {result.improvements.map((s, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "0.85rem",
                    color: "#3f3f46",
                    padding: "6px 0",
                    borderBottom: i < result.improvements.length - 1 ? "1px solid #f4f4f5" : "none",
                  }}
                >
                  • {s}
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div
            className="stat-card"
            style={{
              padding: "1.2rem 1.5rem",
              marginBottom: "2rem",
              borderLeft: "4px solid #aa8eda",
              background: "#faf5ff",
            }}
          >
            <h3 style={{ fontWeight: "700", marginBottom: "0.4rem", fontSize: "0.9rem", color: "#7c3aed" }}>
              Top Tip
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#3f3f46" }}>{result.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}