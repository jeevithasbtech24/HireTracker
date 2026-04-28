import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ResumeScore from "./pages/ResumeScore";
import Toast from "./components/Toast";
import "./App.css";
 
export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ht_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState("login");
  const [toast, setToast] = useState(null);
 
  useEffect(() => {
    if (!user) return;
    const storageKey = `ht_reminders_${user.email}`;
    const reminders = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const today = new Date().toISOString().split("T")[0];
    const due = reminders.filter((r) => r.date === today);
    if (due.length > 0) {
      setToast({
        message: `⏰ ${due.length} reminder(s) due today!`,
        type: "success",
      });
    }
  }, [user]);
 
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
    if (page === "reminders") return (
      <Reminders
        user={user}
        onBack={() => setPage("dashboard")}
        showToast={(msg, type) => setToast({ message: msg, type })}
      />
    );
    if (page === "profile") return (
      <Profile
        user={user}
        onUpdateUser={handleUpdateUser}
        onDeleteAccount={handleLogout}
        onBack={() => setPage("dashboard")}
      />
    );
    if (page === "resume-score") return (
      <ResumeScore user={user} onBack={() => setPage("dashboard")} />
    );
    if (page === "dashboard") return <Dashboard user={user} setPage={setPage} />;
    return <NotFound onBack={() => setPage("dashboard")} />;
  };
 
  return (
    <div className="app">
      {user && <Navbar user={user} onLogout={handleLogout} setPage={setPage} />}
      {renderPage()}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}