export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Hire<span>Tracker</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">Hi, {user.name} 👋</span>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}