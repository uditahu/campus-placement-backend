import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/company/jobs")
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-container">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">My Job Postings</h1>
          <p className="page-subtitle">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/company/post-job" className="btn btn-primary">+ Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <p>No jobs posted yet.</p>
            <Link to="/company/post-job" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
              Post Your First Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
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
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{j.job_title}</td>
                    <td>{j.package_lpa ? `₹${j.package_lpa} LPA` : "—"}</td>
                    <td>{j.vacancies}</td>
                    <td>{j.deadline ? new Date(j.deadline).toLocaleDateString() : "Open"}</td>
                    <td>
                      <span className={`badge ${j.is_active ? 'badge-active' : 'badge-closed'}`}>
                        {j.is_active ? "Active" : "Closed"}
                      </span>
                    </td>
                    <td>
                      <Link to={`/company/job/${j.job_id}/applicants`} className="btn btn-outline btn-sm">
                        View Applicants
                      </Link>
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
