import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

export default function FacultyStudentDetail() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use admin students endpoint since faculty/student/:id doesn't exist in backend
    // The faculty.js we created doesn't have this route - we fetch from assignments data
    Promise.all([
      api.get(`/admin/students/${studentId}`).catch(() => null),
      api.get("/faculty/applications").catch(() => ({ data: [] })),
    ]).then(([studentRes, appsRes]) => {
      if (studentRes) setStudent(studentRes.data);
      // Filter applications for this student
      const studentApps = (appsRes.data || []).filter(a => a.student_id === parseInt(studentId));
      setApplications(studentApps);
    }).finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="spinner" />;
  if (!student) return (
    <div className="page-container">
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <p>Student not found.</p>
          <Link to="/faculty/dashboard" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>← Back</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ marginBottom: 20 }}>
        <Link to="/faculty/dashboard" className="btn btn-outline btn-sm">← Back to Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Student Profile</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎓</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{student.full_name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{student.email}</div>
              </div>
            </div>
            {[
              ["Roll Number", student.roll_number],
              ["Department", student.department],
              ["CGPA", student.cgpa],
              ["Phone", student.phone],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{val || "—"}</span>
              </div>
            ))}
            {student.skills && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>SKILLS</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {student.skills.split(",").map((s, i) => (
                    <span key={i} className="badge badge-blue">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {student.resume_s3_key && (
              <div style={{ marginTop: 16, padding: '10px 12px', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                ✅ Resume on file
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <span className="card-title">Applications ({applications.length})</span>
          </div>
          {applications.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <p>No applications yet.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Job</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(a => (
                    <tr key={a.application_id}>
                      <td>{a.company_name}</td>
                      <td>{a.job_title}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
