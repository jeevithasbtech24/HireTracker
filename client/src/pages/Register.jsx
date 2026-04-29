import { useState } from "react";
import { registerUser, loginUser } from "../services/api";

export default function Register({ onLogin, setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const registerData = await registerUser(form.name, form.email, form.password);
      if (registerData.error) {
        setError(registerData.error);
        return;
      }

      const loginData = await loginUser(form.email, form.password);
      if (loginData.error) {
        setError(loginData.error);
        return;
      }

      localStorage.setItem("ht_user", JSON.stringify({
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email,
        token: loginData.token,
      }));

      onLogin({
        id: loginData.user.id,
        name: loginData.user.name,
        email: loginData.user.email,
        token: loginData.token,
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
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