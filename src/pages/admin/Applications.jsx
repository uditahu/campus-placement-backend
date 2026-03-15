import { useState, useEffect } from "react";
import api from "../../services/api";

const statusConfig = {
  applied:     { cls: "badge-applied" },
  shortlisted: { cls: "badge-shortlisted" },
  rejected:    { cls: "badge-rejected" },
  selected:    { cls: "badge-selected" },
};

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/applications")
      .then(r => setApps(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : apps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No applications yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Company</th>
                  <th>Job</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.application_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.student_name}</td>
                    <td>{a.roll_number || "—"}</td>
                    <td>{a.company_name}</td>
                    <td>{a.job_title}</td>
                    <td>{new Date(a.applied_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${statusConfig[a.status]?.cls || 'badge-applied'}`}>
                        {a.status}
                      </span>
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
