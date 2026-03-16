import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function AdminCompanies() {
  const { API } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/companies`, { credentials:'include' })
      .then(r=>r.json()).then(d=>setCompanies(Array.isArray(d)?d:[]))
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>Companies</h1><p>{companies.length} registered companies</p></div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Company</th><th>Contact Email</th><th>Industry</th><th>Website</th><th>Jobs Posted</th>
                </tr></thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr><td colSpan="5" className="no-data">No companies yet.</td></tr>
                  ) : companies.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.company_name||c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.industry||'—'}</td>
                      <td>{c.website
                        ? <a href={c.website} target="_blank" rel="noreferrer"
                            style={{color:'var(--primary)'}}>{c.website}</a>
                        : '—'}</td>
                      <td>{c.jobs_posted}</td>
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
