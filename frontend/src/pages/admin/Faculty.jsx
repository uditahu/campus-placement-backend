import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function AdminFaculty() {
  const { API } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/faculty`, { credentials:'include' })
      .then(r=>r.json()).then(d=>setFaculty(Array.isArray(d)?d:[]))
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>Faculty</h1><p>{faculty.length} faculty members</p></div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Name</th><th>Email</th><th>Employee ID</th>
                  <th>Department</th><th>Position</th><th>Assigned Students</th>
                </tr></thead>
                <tbody>
                  {faculty.length === 0 ? (
                    <tr><td colSpan="6" className="no-data">No faculty yet.</td></tr>
                  ) : faculty.map(f => (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong></td>
                      <td>{f.email}</td>
                      <td>{f.employee_id||'—'}</td>
                      <td>{f.department||'—'}</td>
                      <td>{f.position||'—'}</td>
                      <td><strong>{f.assigned_students}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
