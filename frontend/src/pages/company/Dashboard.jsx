import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function CompanyDashboard() {
  const { user, API } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/company/jobs`, { credentials: 'include' })
      .then(r => r.json()).then(d => setJobs(Array.isArray(d)?d:[])).catch(() => {});
  }, []);

  const totalApplicants = jobs.reduce((a,j) => a + (j.applicants_count||0), 0);
  const openJobs        = jobs.filter(j => j.status==='open').length;

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Company Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">{jobs.length}</div><div className="stat-label">Total Jobs Posted</div></div>
          <div className="stat-card"><div className="stat-number">{openJobs}</div><div className="stat-label">Open Jobs</div></div>
          <div className="stat-card"><div className="stat-number">{totalApplicants}</div><div className="stat-label">Total Applicants</div></div>
        </div>
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div className="card-title" style={{marginBottom:0}}>Recent Job Postings</div>
            <Link to="/company/jobs" className="btn btn-primary btn-sm">+ Post New Job</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="no-data">No jobs posted yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Title</th><th>Vacancies</th><th>Applicants</th><th>Status</th><th>Posted</th></tr></thead>
                <tbody>
                  {jobs.slice(0,5).map(j => (
                    <tr key={j.id}>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.vacancies}</td>
                      <td>{j.applicants_count}</td>
                      <td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
                      <td>{new Date(j.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
