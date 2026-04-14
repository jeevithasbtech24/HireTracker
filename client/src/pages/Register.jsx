import { useState } from "react";

export default function Register({ onLogin, setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("ht_users") || "[]");
    if (users.find((u) => u.email === form.email)) {
      setError("Email already registered.");
      return;
    }
    users.push({ name: form.name, email: form.email, password: form.password });
    localStorage.setItem("ht_users", JSON.stringify(users));
    onLogin({ name: form.name, email: form.email });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Start tracking your job hunt today</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Create Account
          </button>
        </form>
        <div className="auth-switch">
          Already have an account?{" "}
          <button onClick={() => setPage("login")}>Login</button>
        </div>
      </div>
    </div>
  );
}