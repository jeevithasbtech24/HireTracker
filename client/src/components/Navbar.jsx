import { useEffect } from "react";

export default function Navbar({ user, onLogout, setPage }) {

  // ✅ Remove dark class from body on mount (cleanup)
  useEffect(() => {
    document.body.classList.remove("dark");
    localStorage.removeItem("ht_theme");
  }, []);

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
        <button className="btn-nav" onClick={() => setPage("weekly-report")}>
          Weekly Report
        </button>
        <button className="btn-nav" onClick={() => setPage("profile")}>
          Profile
        </button>
        <span className="navbar-user">Hi, {user.name}</span>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}