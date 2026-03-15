import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Alert from "../../components/Alert";

const statusConfig = {
  applied:     { cls: "badge-applied",     color: "#475569" },
  shortlisted: { cls: "badge-shortlisted", color: "#d97706" },
  rejected:    { cls: "badge-rejected",    color: "#dc2626" },
  selected:    { cls: "badge-selected",    color: "#16a34a" },
};

export default function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [updating, setUpdating] = useState(null);

  const fetchApplicants = () => {
    api.get(`/company/jobs/${jobId}/applicants`).then(r => setApplicants(r.data)).catch(console.error);
  };

  useEffect(fetchApplicants, [jobId]);

  const updateStatus = async (applicationId, status) => {
    setUpdating(applicationId);
    try {
      await api.patch(`/company/jobs/${jobId}/applicants/${applicationId}`, { status });
      setAlert({ type: "success", message: `Status updated to "${status}".` });
      fetchApplicants();
    } catch {
      setAlert({ type: "danger", message: "Update failed." });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 20 }}>
        <Link to="/company/dashboard" className="btn btn-outline btn-sm">← Back to Jobs</Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Applicants</h1>
        <p className="page-subtitle">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      {applicants.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>No applicants yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {applicants.map(a => (
            <div className="card" key={a.application_id}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{a.full_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.email}</div>
                  </div>
                  <span className={`badge ${statusConfig[a.status]?.cls || 'badge-applied'}`}>{a.status}</span>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {a.department && <span>🏫 {a.department}</span>}
                  {a.cgpa && <span>📊 CGPA {a.cgpa}</span>}
                  {a.roll_number && <span>🔖 {a.roll_number}</span>}
                  {a.phone && <span>📞 {a.phone}</span>}
                </div>

                {a.skills && (
                  <div style={{ marginBottom: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {a.skills.split(",").map((s, i) => (
                      <span key={i} className="badge badge-blue" style={{ fontSize: 11 }}>{s.trim()}</span>
                    ))}
                  </div>
                )}

                <div className="status-actions">
                  {["applied", "shortlisted", "selected", "rejected"].map(s => (
                    <button
                      key={s}
                      className="status-btn"
                      disabled={a.status === s || updating === a.application_id}
                      onClick={() => updateStatus(a.application_id, s)}
                      style={{
                        borderColor: statusConfig[s]?.color || '#475569',
                        color: a.status === s ? 'white' : (statusConfig[s]?.color || '#475569'),
                        background: a.status === s ? (statusConfig[s]?.color || '#475569') : 'transparent',
                        opacity: updating === a.application_id ? 0.6 : 1,
                        textTransform: 'capitalize',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
