import { useState, useEffect } from "react";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    api.get("/admin/jobs")
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchJobs, []);

  const toggle = async (id) => {
    try {
      await api.patch(`/admin/jobs/${id}/toggle`);
      fetchJobs();
    } catch {
      setAlert({ type: "danger", message: "Toggle failed." });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Jobs</h1>
        <p className="page-subtitle">{jobs.length} job posting{jobs.length !== 1 ? 's' : ''}</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <div className="card">
        {loading ? <div className="spinner" /> : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <p>No jobs posted yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Package</th>
                  <th>Vacancies</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.job_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{j.company_name}</td>
                    <td>{j.job_title}</td>
                    <td>{j.package_lpa ? `₹${j.package_lpa} LPA` : "—"}</td>
                    <td>{j.vacancies}</td>
                    <td>{j.deadline ? new Date(j.deadline).toLocaleDateString() : "Open"}</td>
                    <td>
                      <span className={`badge ${j.is_active ? 'badge-active' : 'badge-closed'}`}>
                        {j.is_active ? "Active" : "Closed"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${j.is_active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggle(j.job_id)}
                      >
                        {j.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
