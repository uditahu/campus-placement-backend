import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const routes = {
        student: "/student/dashboard",
        faculty: "/faculty/dashboard",
        company: "/company/dashboard",
        admin: "/admin/dashboard"
      };
      navigate(routes[data.role] || "/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎓 Cloud MPR</div>
        <p className="auth-sub">Campus Placement & Recruitment Portal</p>

        <Alert type="danger" message={error} onClose={() => setError("")} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: 8, justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              Register here
            </Link>
          </span>
        </div>

        <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Admin:</strong> admin@campus.com / Admin@123
        </div>
      </div>
    </div>
  );
}
