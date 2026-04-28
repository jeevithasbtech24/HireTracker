import { useEffect, useState } from "react";
 
export default function Navbar({ user, onLogout, setPage }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("ht_theme") === "dark";
  });
 
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("ht_theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("ht_theme", "light");
    }
  }, [dark]);
 
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Hire<span>Tracker</span>
      </div>
      <div className="navbar-right">
        <button className="btn-nav" onClick={() => setPage("dashboard")}>
          Dashboard
        </button>
        <button className="btn-nav" onClick={() => setPage("wishlist")}>
          Wishlist
        </button>
        <button className="btn-nav" onClick={() => setPage("reminders")}>
          Reminders
        </button>
        <button className="btn-nav" onClick={() => setPage("resume-score")}>
          Resume Score
        </button>
        <button className="btn-nav" onClick={() => setPage("profile")}>
          Profile
        </button>
        <span className="navbar-user">Hi, {user.name}</span>
        <button
          className="btn-nav"
          onClick={() => setDark(!dark)}
          title="Toggle theme"
          style={{ fontSize: "1.1rem", padding: "6px 10px" }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}