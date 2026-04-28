import { useState } from "react";

export default function Profile({ user, onUpdateUser, onDeleteAccount, onBack }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("success");

  // Bio state
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

  const handleSaveName = () => {
    if (!name.trim()) return showMsg("Name can't be empty!", "error");
    const updated = { ...user, name: name.trim() };
    localStorage.setItem("ht_user", JSON.stringify(updated));
    onUpdateUser(updated);
    setEditing(false);
    showMsg("Name updated!");
  };

  const handleChangePassword = () => {
    const stored = JSON.parse(localStorage.getItem("ht_user"));
    if (currentPassword !== stored.password)
      return showMsg("Current password is wrong!", "error");
    if (newPassword.length < 6)
      return showMsg("New password must be 6+ characters!", "error");
    if (newPassword !== confirmPassword)
      return showMsg("Passwords don't match!", "error");
    const updated = { ...user, password: newPassword };
    localStorage.setItem("ht_user", JSON.stringify(updated));
    onUpdateUser(updated);
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

  return (
    <div style={{ maxWidth: "560px", margin: "40px auto", padding: "0 20px" }}>

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

      {/* Page Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f0f0f", margin: 0 }}>
          Account Settings
        </h1>
        <button onClick={onBack} className="btn-logout">← Back</button>
      </div>

      {/* Section 1 — Profile */}
      <div style={{
        background: "white", borderRadius: "14px",
        border: "1px solid #e4e4e7", marginBottom: "16px", overflow: "hidden"
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f4f4f5" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#a1a1aa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Profile
          </span>
        </div>

        {/* Avatar Row */}
        <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "18px", borderBottom: "1px solid #f4f4f5" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%",
            background: "#0f0f0f",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "700", color: "white", flexShrink: 0
          }}>
            {getInitials(user.name)}
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "16px", color: "#0f0f0f" }}>{user.name}</div>
            <div style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "2px" }}>{user.email}</div>
          </div>
        </div>

        {/* Edit Name Row */}
        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#3f3f46", marginBottom: "10px" }}>
            Display Name
          </div>
          {editing ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="filter-search"
                style={{ maxWidth: "260px" }}
                placeholder="Your name"
                autoFocus
              />
              <button className="btn-save" style={{ flex: "none", padding: "9px 18px" }} onClick={handleSaveName}>
                Save
              </button>
              <button className="btn-cancel" style={{ flex: "none" }} onClick={() => { setEditing(false); setName(user.name); }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "#0f0f0f" }}>{user.name}</span>
              <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      </div>

      {/* Section 2 — Password */}
      <div style={{
        background: "white", borderRadius: "14px",
        border: "1px solid #e4e4e7", marginBottom: "16px", overflow: "hidden"
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f4f4f5" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#a1a1aa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Password
          </span>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="password"
            className="filter-search"
            style={{ width: "100%" }}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="filter-search"
            style={{ width: "100%" }}
            placeholder="New password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="filter-search"
            style={{ width: "100%" }}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn-save" onClick={handleChangePassword}>
            Update Password
          </button>
        </div>
      </div>

      {/* Section 3 — About Me / Bio */}
      <div style={{
        background: "white", borderRadius: "14px",
        border: "1px solid #e4e4e7", marginBottom: "16px", overflow: "hidden"
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f4f4f5" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#a1a1aa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            About Me
          </span>
          <div style={{ fontSize: "11px", color: "#c4c4cc", marginTop: "2px" }}>
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
                placeholder="Write about yourself: your skills, experience, what kind of roles you're looking for, key achievements..."
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "8px",
                  border: "1.5px solid #e4e4e7", fontSize: "14px",
                  fontFamily: "inherit", resize: "vertical",
                  boxSizing: "border-box", color: "#0f0f0f",
                  background: "#fafafa", lineHeight: "1.6",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn-save" style={{ padding: "9px 18px" }} onClick={handleSaveBio}>
                  Save Bio
                </button>
                <button className="btn-cancel" onClick={() => { setEditingBio(false); setBioInput(bio); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <p style={{
                fontSize: "14px", color: bio ? "#0f0f0f" : "#a1a1aa",
                margin: 0, lineHeight: "1.7", flex: 1,
              }}>
                {bio || "No bio yet. Add one to generate better, personalized cover letters!"}
              </p>
              <button
                className="btn-edit"
                style={{ flexShrink: 0 }}
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
        background: "white", borderRadius: "14px",
        border: "1px solid #fecaca", marginBottom: "40px", overflow: "hidden"
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #fecaca", background: "#fff5f5" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Danger Zone
          </span>
        </div>
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f0f0f" }}>Delete Account</div>
            <div style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "2px" }}>Permanently removes all your data</div>
          </div>
          <button className="btn-delete" onClick={handleDeleteAccount}>Delete</button>
        </div>
      </div>

    </div>
  );
}