import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function FacultyStudents() {
  const { API } = useAuth();
  const [tab,  setTab]   = useState('assigned');
  const [rows, setRows]  = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (t) => {
    setLoading(true);
    const url = t==='assigned' ? `${API}/api/faculty/students` : `${API}/api/faculty/all-students`;
    fetch(url, { credentials: 'include' })
      .then(r => r.json()).then(d => setRows(Array.isArray(d)?d:[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Students</h1>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:20}}>
          {['assigned','all'].map(t => (
            <button key={t} className={`btn ${tab===t?'btn-primary':'btn-outline'}`}
              onClick={() => setTab(t)}>
              {t==='assigned'?'🔗 My Assigned Students':'👥 All Students'}
            </button>
          ))}
        </div>
        <div className="card">
          {loading ? <div className="loading" style={{minHeight:200}}><div className="spinner" /></div> : (
            rows.length === 0 ? (
              <div className="no-data">No students found.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Branch</th>
                    <th>CGPA</th><th>Year</th><th>Skills</th><th>Resume</th>
                  </tr></thead>
                  <tbody>
                    {rows.map((s,i) => (
                      <tr key={i}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.email}</td>
                        <td>{s.branch||'—'}</td>
                        <td>{s.cgpa||'—'}</td>
                        <td>{s.year ? `Y${s.year}` : '—'}</td>
                        <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {s.skills||'—'}
                        </td>
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
            )
          )}
        </div>
      </main>
    </div>
  );
}
