import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ht_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState("login");

  useEffect(() => {
    if (user) setPage("dashboard");
    else setPage("login");
  }, [user]);

  const handleLogin = (userData) => {
    localStorage.setItem("ht_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("ht_user");
    setUser(null);
  };

  return (
    <div className="app">
      {user && <Navbar user={user} onLogout={handleLogout} setPage={setPage} />}
      {!user && page === "login" && (
        <Login onLogin={handleLogin} setPage={setPage} />
      )}
      {!user && page === "register" && (
        <Register onLogin={handleLogin} setPage={setPage} />
      )}
      {user && <Dashboard user={user} />}
    </div>
  );
}