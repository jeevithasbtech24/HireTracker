export default function Navbar({ user, onLogout, setPage }) {
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
        <button className="btn-nav" onClick={() => setPage("profile")}>
           Profile
        </button>
        <span className="navbar-user">Hi, {user.name} 👋</span>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}