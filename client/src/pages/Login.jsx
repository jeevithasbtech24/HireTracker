import { useState } from "react";

export default function Login({ onLogin, setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("ht_users") || "[]");
    const found = users.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (!found) {
      setError("Invalid email or password.");
      return;
    }
    onLogin({ name: found.name, email: found.email });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back!</h2>
        <p>Login to track your job applications</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <div className="auth-switch">
          Don't have an account?{" "}
          <button onClick={() => setPage("register")}>Register</button>
        </div>
      </div>
    </div>
  );
}