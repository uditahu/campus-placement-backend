import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const STATUS_OPTIONS = ['applied','shortlisted','rejected','selected'];

export default function CompanyApplicants() {
  const { id } = useParams();
  const { API } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetch(`${API}/api/company/jobs/${id}/applicants`, { credentials:'include' })
    .then(r => r.json()).then(d => setApplicants(Array.isArray(d)?d:[]))
    .finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (appId, status) => {
    await fetch(`${API}/api/company/applications/${appId}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ status }),
    });
    setApplicants(p => p.map(a => a.app_id===appId ? {...a, status} : a));
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <Link to="/company/jobs" style={{color:'var(--muted)',fontSize:13,textDecoration:'none'}}>
            ← Back to Jobs
          </Link>
          <h1 style={{marginTop:6}}>Job Applicants</h1>
          <p>{applicants.length} student{applicants.length!==1?'s':''} applied</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="card">
            {applicants.length === 0 ? (
              <div className="no-data">No applicants yet.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Branch</th><th>CGPA</th>
                    <th>Skills</th><th>Resume</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    {applicants.map(a => (
                      <tr key={a.app_id}>
                        <td><strong>{a.name}</strong></td>
                        <td>{a.email}</td>
                        <td>{a.branch||'—'}</td>
                        <td>{a.cgpa||'—'}</td>
                        <td style={{maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {a.skills||'—'}
                        </td>
                        <td>
                          {a.resume_url
                            ? <a href={a.resume_url} target="_blank" rel="noreferrer"
                                className="btn btn-outline btn-sm">📄 View</a>
                            : <span style={{color:'var(--muted)'}}>None</span>}
                        </td>
                        <td>
                          <select value={a.status}
                            onChange={e => updateStatus(a.app_id, e.target.value)}
                            style={{border:'1px solid var(--border)',borderRadius:6,padding:'5px 8px',fontSize:13}}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
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
