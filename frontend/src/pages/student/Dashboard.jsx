import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function StudentDashboard() {
  const { user, API } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, applied: 0, shortlisted: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/student/jobs`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/api/student/applications`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([jobs, apps]) => {
      setStats({
        jobs:        Array.isArray(jobs) ? jobs.length : 0,
        applied:     Array.isArray(apps) ? apps.length : 0,
        shortlisted: Array.isArray(apps) ? apps.filter(a => a.status === 'shortlisted').length : 0,
      });
      setRecent(Array.isArray(apps) ? apps.slice(0, 5) : []);
    }).catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Here&apos;s your placement activity overview</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.jobs}</div>
            <div className="stat-label">Open Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.applied}</div>
            <div className="stat-label">Applied</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.shortlisted}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Recent Applications</div>
          {recent.length === 0 ? (
            <div style={{textAlign:'center',padding:'30px',color:'var(--muted)'}}>
              <p>No applications yet.</p>
              <Link to="/student/jobs" className="btn btn-primary btn-sm" style={{marginTop:10,display:'inline-block'}}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Company</th><th>Role</th><th>Status</th><th>Applied</th>
                </tr></thead>
                <tbody>
                  {recent.map(a => (
                    <tr key={a.id}>
                      <td>{a.company_name}</td>
                      <td>{a.title}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td>{new Date(a.applied_at).toLocaleDateString()}</td>
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
