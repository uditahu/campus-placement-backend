import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function StudentApplications() {
  const { API } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/student/applications`, { credentials: 'include' })
      .then(r => r.json()).then(d => setApps(Array.isArray(d)?d:[])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>My Applications</h1>
          <p>{apps.length} total application{apps.length!==1?'s':''}</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            {apps.length === 0 ? (
              <div style={{textAlign:'center',padding:40,color:'var(--muted)'}}>
                You haven&apos;t applied to any jobs yet.
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>Company</th><th>Role</th><th>Industry</th><th>Status</th><th>Applied On</th>
                  </tr></thead>
                  <tbody>
                    {apps.map(a => (
                      <tr key={a.id}>
                        <td><strong>{a.company_name}</strong></td>
                        <td>{a.title}</td>
                        <td>{a.industry}</td>
                        <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                        <td>{new Date(a.applied_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
