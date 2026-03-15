import { useState, useEffect } from "react";
import api from "../../services/api";

const statusConfig = {
  applied:     { cls: "badge-applied",     label: "Applied" },
  shortlisted: { cls: "badge-shortlisted", label: "Shortlisted" },
  rejected:    { cls: "badge-rejected",    label: "Rejected" },
  selected:    { cls: "badge-selected",    label: "Selected 🎉" },
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/applications")
      .then(r => setApps(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">{apps.length} application{apps.length !== 1 ? 's' : ''} submitted</p>
      </div>

      {apps.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>You haven't applied to any jobs yet.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Title</th>
                  <th>Package</th>
                  <th>Deadline</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.application_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.company_name}</td>
                    <td>{a.job_title}</td>
                    <td>{a.package_lpa ? `₹${a.package_lpa} LPA` : "—"}</td>
                    <td>{a.deadline ? new Date(a.deadline).toLocaleDateString() : "Open"}</td>
                    <td>{new Date(a.applied_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${statusConfig[a.status]?.cls || 'badge-applied'}`}>
                        {statusConfig[a.status]?.label || a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
