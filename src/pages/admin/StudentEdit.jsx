import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/admin/students/${id}`).then(r => setForm(r.data)).catch(console.error);
  }, [id]);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/admin/students/${id}`, form);
      setAlert({ type: "success", message: "Saved. Redirecting…" });
      setTimeout(() => navigate("/admin/students"), 1200);
    } catch {
      setAlert({ type: "danger", message: "Save failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 20 }}>
        <Link to="/admin/students" className="btn btn-outline btn-sm">← Back to Students</Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Edit Student</h1>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-body">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
          <form onSubmit={handleSave}>
            {[
              { name: "full_name", label: "Full Name" },
              { name: "roll_number", label: "Roll Number" },
              { name: "department", label: "Department" },
              { name: "cgpa", label: "CGPA", type: "number" },
              { name: "skills", label: "Skills" },
              { name: "phone", label: "Phone" },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input
                  type={f.type || "text"}
                  className="form-control"
                  step={f.type === "number" ? "0.01" : undefined}
                  value={form[f.name] || ""}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving…" : "Save Changes"}
              </button>
              <Link to="/admin/students" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
