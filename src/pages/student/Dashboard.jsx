import { useState, useEffect } from "react";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    api.get("/student/jobs").then(r => setJobs(r.data)).catch(console.error);
    api.get("/student/applications").then(r => {
      setApplied(new Set(r.data.map(a => a.job_id)));
    }).catch(console.error);
  }, []);

  const applyJob = async (jobId) => {
    setApplying(jobId);
    try {
      await api.post(`/student/apply/${jobId}`);
      setAlert({ type: "success", message: "Applied successfully! 🎉" });
      setApplied(prev => new Set([...prev, jobId]));
    } catch (err) {
      setAlert({ type: "danger", message: err.response?.data?.message || "Apply failed." });
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Available Jobs</h1>
        <p className="page-subtitle">{jobs.length} active job posting{jobs.length !== 1 ? 's' : ''}</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <p>No active job postings at the moment.</p>
            <p className="text-sm" style={{ marginTop: 4 }}>Check back soon!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {jobs.map(job => (
            <div className="job-card" key={job.job_id}>
              <div className="company-badge">🏢 {job.company_name}</div>
              <div className="job-title">{job.job_title}</div>
              {job.description && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
                  {job.description.slice(0, 100)}…
                </p>
              )}
              <div className="job-meta">
                <span className="meta-item">💰 ₹{job.package_lpa} LPA</span>
                <span className="meta-item">👥 {job.vacancies} vacancy{job.vacancies !== 1 ? 'ies' : ''}</span>
                <span className="meta-item">🏭 {job.industry}</span>
                {job.deadline && (
                  <span className="meta-item">📅 {new Date(job.deadline).toLocaleDateString()}</span>
                )}
              </div>
              {job.eligibility_criteria && (
                <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  <strong>Eligibility:</strong> {job.eligibility_criteria}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {applied.has(job.job_id) ? (
                  <span className="badge badge-selected">✓ Applied</span>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => applyJob(job.job_id)}
                    disabled={applying === job.job_id}
                  >
                    {applying === job.job_id ? "Applying…" : "Apply Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
