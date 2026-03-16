import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function AdminStudents() {
  const { API } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/students`, { credentials:'include' })
      .then(r=>r.json()).then(d=>setStudents(Array.isArray(d)?d:[]))
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>All Students</h1><p>{students.length} students registered</p></div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Name</th><th>Email</th><th>College ID</th><th>Branch</th>
                  <th>CGPA</th><th>Year</th><th>Applications</th><th>Resume</th>
                </tr></thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan="8" className="no-data">No students yet.</td></tr>
                  ) : students.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.email}</td>
                      <td>{s.college_id||'—'}</td>
                      <td>{s.branch||'—'}</td>
                      <td>{s.cgpa||'—'}</td>
                      <td>{s.year ? `Y${s.year}` : '—'}</td>
                      <td>{s.applications_count}</td>
                      <td>
                        {s.resume_url
                          ? <a href={s.resume_url} target="_blank" rel="noreferrer"
                              className="btn btn-outline btn-sm">📄 View</a>
                          : <span style={{color:'var(--muted)'}}>None</span>}
                      </td>
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
