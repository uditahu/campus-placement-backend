import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    job_title: "", vacancies: 1, description: "",
    eligibility_criteria: "", package_lpa: "", deadline: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/company/jobs", form);
      setAlert({ type: "success", message: "Job posted successfully! Redirecting…" });
      setTimeout(() => navigate("/company/dashboard"), 1500);
    } catch (err) {
      setAlert({ type: "danger", message: err.response?.data?.message || "Post failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 20 }}>
        <Link to="/company/dashboard" className="btn btn-outline btn-sm">← Back</Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Post a New Job</h1>
        <p className="page-subtitle">Fill in the details below to create a job listing</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-body">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Job Title <span style={{color:'var(--red)'}}>*</span></label>
              <input type="text" className="form-control" placeholder="e.g. Software Engineer"
                     required value={form.job_title}
                     onChange={e => setForm({ ...form, job_title: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Vacancies</label>
                <input type="number" className="form-control" min={1} value={form.vacancies}
                       onChange={e => setForm({ ...form, vacancies: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Package (LPA)</label>
                <input type="number" className="form-control" step="0.1" placeholder="e.g. 6.5"
                       value={form.package_lpa}
                       onChange={e => setForm({ ...form, package_lpa: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input type="date" className="form-control" value={form.deadline}
                     onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea className="form-control" rows={4} placeholder="Describe the role, responsibilities…"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Eligibility Criteria</label>
              <textarea className="form-control" rows={2} placeholder="e.g. CGPA > 7.0, B.Tech in CS/IT"
                        value={form.eligibility_criteria}
                        onChange={e => setForm({ ...form, eligibility_criteria: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Posting…" : "Post Job"}
              </button>
              <Link to="/company/dashboard" className="btn btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
