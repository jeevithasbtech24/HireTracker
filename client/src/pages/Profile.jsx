import { useState } from "react";
import { changePassword, updateName } from "../services/api";

export default function Profile({ user, onUpdateUser, onDeleteAccount, onBack }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("success");

  const [bio, setBio] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("ht_user") || "{}");
    return stored.bio || "";
  });
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(bio);

  const showMsg = (text, type = "success") => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(null), 3000);
  };

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSaveName = async () => {
    if (!name.trim()) return showMsg("Name can't be empty!", "error");
    const data = await updateName(name.trim());
    if (data.error) return showMsg(data.error, "error");
    const updated = { ...user, name: name.trim() };
    localStorage.setItem("ht_user", JSON.stringify(updated));
    onUpdateUser(updated);
    setEditing(false);
    showMsg("Name updated!");
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) return showMsg("New password must be 6+ characters!", "error");
    if (newPassword !== confirmPassword) return showMsg("Passwords don't match!", "error");
    const data = await changePassword(currentPassword, newPassword);
    if (data.error) return showMsg(data.error, "error");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    showMsg("Password changed!");
  };

  const handleSaveBio = () => {
    const updated = { ...user, bio: bioInput.trim() };
    localStorage.setItem("ht_user", JSON.stringify(updated));
    onUpdateUser(updated);
    setBio(bioInput.trim());
    setEditingBio(false);
    showMsg("Bio saved!");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "This will permanently delete your account and all data. Are you sure?"
    );
    if (!confirmed) return;
    localStorage.removeItem("ht_user");
    localStorage.removeItem(`ht_jobs_${user.email}`);
    localStorage.removeItem(`ht_reminders_${user.email}`);
    localStorage.removeItem(`ht_wishlist_${user.email}`);
    onDeleteAccount();
  };

  const cardStyle = {
    background: "white",
    borderRadius: "14px",
    border: "1px solid #e0e7ff",
    marginBottom: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(124,58,237,0.06)",
  };

  // ✅ Light pink card header
  const cardHeaderStyle = {
    padding: "14px 20px",
    borderBottom: "1px solid #fce7f3",
    background: "#fdf2f8",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid #ddd6fe",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    color: "#1e1b4b",
    background: "#faf5ff",
    outline: "none",
  };

  // ✅ Lighter purple button
  const btnSave = {
    background: "#a78bfa",
    color: "white",
    border: "none",
    padding: "9px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
  };

  const btnCancel = {
    background: "#f4f4f5",
    color: "#52525b",
    border: "none",
    padding: "9px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  };

  const btnEdit = {
    background: "#ede9fe",
    color: "#7c3aed",
    border: "none",
    padding: "6px 14px",
    borderRadius: "7px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  };

  return (
    <div style={{
      minHeight: "100vh",
      // ✅ More blue, very light purple tint at end
      background: "linear-gradient(135deg, #dbeafe 0%, #e8e4fa 100%)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        {/* Toast */}
        {msg && (
          <div style={{
            position: "fixed", bottom: "28px", right: "28px",
            background: msgType === "success" ? "#16a34a" : "#dc2626",
            color: "white", padding: "12px 20px", borderRadius: "10px",
            fontWeight: "600", fontSize: "14px", zIndex: 9999,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            {msgType === "success" ? "✓" : "✕"} {msg}
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>
            Account Settings
          </h1>
          <button
            onClick={onBack}
            style={{
              background: "white",
              border: "1.5px solid #ddd6fe",
              color: "#7c3aed",
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

        {/* Section 1 — Profile */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#be185d", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Profile
            </span>
          </div>

          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "18px", borderBottom: "1px solid #fce7f3" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: "700", color: "white", flexShrink: 0,
              boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
            }}>
              {getInitials(user.name)}
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "#1e1b4b" }}>{user.name}</div>
              <div style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "2px" }}>{user.email}</div>
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#be185d", marginBottom: "10px" }}>
              Display Name
            </div>
            {editing ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ ...inputStyle, maxWidth: "260px" }}
                  placeholder="Your name"
                  autoFocus
                />
                <button style={{ ...btnSave, width: "auto", flex: "none", padding: "9px 18px" }} onClick={handleSaveName}>
                  Save
                </button>
                <button style={{ ...btnCancel, flex: "none" }} onClick={() => { setEditing(false); setName(user.name); }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", color: "#1e1b4b" }}>{user.name}</span>
                <button style={btnEdit} onClick={() => setEditing(true)}>Edit</button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 — Password */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#be185d", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Password
            </span>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="password"
              style={inputStyle}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              style={inputStyle}
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              style={inputStyle}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button style={btnSave} onClick={handleChangePassword}>
              Update Password
            </button>
          </div>
        </div>

        {/* Section 3 — About Me */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#be185d", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              About Me
            </span>
            <div style={{ fontSize: "11px", color: "#f9a8d4", marginTop: "2px" }}>
              Used to generate personalized cover letters
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            {editingBio ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={5}
                  placeholder="Write about yourself: your skills, experience, what kind of roles you're looking for..."
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: "1.6",
                  }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ ...btnSave, width: "auto", padding: "9px 18px" }} onClick={handleSaveBio}>
                    Save Bio
                  </button>
                  <button style={btnCancel} onClick={() => { setEditingBio(false); setBioInput(bio); }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <p style={{
                  fontSize: "14px", color: bio ? "#1e1b4b" : "#a1a1aa",
                  margin: 0, lineHeight: "1.7", flex: 1,
                }}>
                  {bio || "No bio yet. Add one to generate better, personalized cover letters!"}
                </p>
                <button
                  style={{ ...btnEdit, flexShrink: 0 }}
                  onClick={() => { setEditingBio(true); setBioInput(bio); }}
                >
                  {bio ? "Edit" : "Add"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 — Danger Zone */}
        <div style={{
          background: "white",
          borderRadius: "14px",
          border: "1px solid #fecaca",
          marginBottom: "40px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(239,68,68,0.06)",
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #fecaca", background: "#fff5f5" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Danger Zone
            </span>
          </div>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", color: "#1e1b4b" }}>Delete Account</div>
              <div style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "2px" }}>Permanently removes all your data</div>
            </div>
            <button
              onClick={handleDeleteAccount}
              style={{
                background: "#fff0f0",
                color: "#ef4444",
                border: "1.5px solid #fecaca",
                padding: "7px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}