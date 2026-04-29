import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onLogin, setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      if (data.error) {
        setError(data.error);
        return;
      }
      // Save token + user info to localStorage
      localStorage.setItem("ht_user", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      }));
      onLogin({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      });
    } catch (err) {
      setError("Something went wrong. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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