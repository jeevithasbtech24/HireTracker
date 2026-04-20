import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ht_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState("login");

  const handleLogin = (userData) => {
    localStorage.setItem("ht_user", JSON.stringify(userData));
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("ht_user");
    setUser(null);
    setPage("login");
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const renderPage = () => {
    if (!user) {
      if (page === "register") return <Register onLogin={handleLogin} setPage={setPage} />;
      return <Login onLogin={handleLogin} setPage={setPage} />;
    }

    if (page === "wishlist") return <Wishlist user={user} onBack={() => setPage("dashboard")} />;
    if (page === "reminders") return <Reminders user={user} onBack={() => setPage("dashboard")} />;
    if (page === "profile") return (
      <Profile
        user={user}
        onUpdateUser={handleUpdateUser}
        onDeleteAccount={handleLogout}
        onBack={() => setPage("dashboard")}
      />
    );
    if (page === "dashboard") return <Dashboard user={user} setPage={setPage} />;
    return <NotFound onBack={() => setPage("dashboard")} />;
  };

  return (
    <div className="app">
      {user && <Navbar user={user} onLogout={handleLogout} setPage={setPage} />}
      {renderPage()}
    </div>
  );
}