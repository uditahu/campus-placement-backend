import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/faculty")
      .then(r => setFaculty(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Faculty</h1>
        <p className="page-subtitle">{faculty.length} faculty member{faculty.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : faculty.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍🏫</div>
            <p>No faculty members registered yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map(f => (
                  <tr key={f.faculty_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.full_name}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{f.email}</td>
                    <td>{f.employee_id || "—"}</td>
                    <td>{f.department || "—"}</td>
                    <td>{f.position || "—"}</td>
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
