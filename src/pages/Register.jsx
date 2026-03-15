import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Alert from "../components/Alert";

const roleFields = {
  student: [
    { name: "full_name", label: "Full Name", required: true },
    { name: "roll_number", label: "Roll Number" },
    { name: "department", label: "Department" },
    { name: "cgpa", label: "CGPA", type: "number" },
    { name: "skills", label: "Skills (comma-separated)" },
    { name: "phone", label: "Phone" },
  ],
  faculty: [
    { name: "full_name", label: "Full Name", required: true },
    { name: "employee_id", label: "Employee ID" },
    { name: "department", label: "Department" },
    { name: "position", label: "Position" },
  ],
  company: [
    { name: "company_name", label: "Company Name", required: true },
    { name: "industry", label: "Industry" },
    { name: "website", label: "Website" },
    { name: "contact_person", label: "Contact Person" },
  ],
};

const roleColors = { student: "#1d4ed8", faculty: "#7c3aed", company: "#d97706" };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setAlert({ type: "success", message: "Registration successful! Redirecting to login…" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setAlert({ type: "danger", message: err.response?.data?.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">Create Account</div>
        <p className="auth-sub">Register as a Student, Faculty, or Company</p>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              {["student", "faculty", "company"].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid',
                    borderColor: form.role === r ? roleColors[r] : 'var(--border-strong)',
                    background: form.role === r ? `${roleColors[r]}15` : 'white',
                    color: form.role === r ? roleColors[r] : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="you@example.com"
                   value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Min. 6 characters"
                   value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0', paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Profile Details
            </p>
            {roleFields[form.role].map(f => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}{f.required && <span style={{color:'var(--red)'}}> *</span>}</label>
                <input
                  type={f.type || "text"}
                  className="form-control"
                  required={!!f.required}
                  step={f.type === "number" ? "0.01" : undefined}
                  value={form[f.name] || ""}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          Already registered?{" "}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
