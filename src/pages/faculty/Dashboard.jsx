import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/faculty/profile").catch(() => null),
      // FIXED: was /faculty/assigned-students, correct endpoint is /faculty/assignments
      api.get("/faculty/assignments").catch(() => ({ data: [] })),
    ]).then(([profileRes, studentsRes]) => {
      if (profileRes) setProfile(profileRes.data);
      setStudents(studentsRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-container">
      <div className="page-header">
        {profile && (
          <>
            <h1 className="page-title">Welcome, {profile.full_name}</h1>
            <p className="page-subtitle">{profile.department} · {profile.position}</p>
          </>
        )}
        {!profile && <h1 className="page-title">Faculty Dashboard</h1>}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍🏫</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{students.length} Assigned Student{students.length !== 1 ? 's' : ''}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Students under your mentorship</div>
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <p>No students assigned to you yet.</p>
            <p className="text-sm" style={{ marginTop: 4 }}>Contact the admin to get students assigned.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Assigned Students</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No.</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                  <th>Assigned On</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.assignment_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.student_name}</td>
                    <td>{s.roll_number || "—"}</td>
                    <td>{s.department || "—"}</td>
                    <td>{s.cgpa || "—"}</td>
                    <td>
                      {s.skills ? (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {s.skills.split(",").slice(0, 3).map((sk, i) => (
                            <span key={i} className="badge badge-blue" style={{ fontSize: 11 }}>{sk.trim()}</span>
                          ))}
                        </div>
                      ) : "—"}
                    </td>
                    <td>{new Date(s.assigned_at).toLocaleDateString()}</td>
                    <td>
                      <Link
                        to={`/faculty/student/${s.student_id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View
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
