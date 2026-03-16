import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function FacultyDashboard() {
  const { user, API } = useAuth();
  const [profile, setProfile] = useState(null);
  const [count, setCount]     = useState(0);

  useEffect(() => {
    fetch(`${API}/api/faculty/profile`, { credentials: 'include' })
      .then(r => r.json()).then(setProfile).catch(() => {});
    fetch(`${API}/api/faculty/students`, { credentials: 'include' })
      .then(r => r.json()).then(d => setCount(Array.isArray(d)?d.length:0)).catch(() => {});
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Faculty Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{count}</div>
            <div className="stat-label">Assigned Students</div>
          </div>
        </div>
        {profile && (
          <div className="card">
            <div className="card-title">Your Profile</div>
            <div className="form-row">
              {[
                ['Department', profile.department],
                ['Position',   profile.position],
                ['Employee ID',profile.employee_id],
                ['Phone',      profile.phone],
              ].map(([k,v]) => (
                <div key={k} style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.4px',fontWeight:700}}>{k}</div>
                  <div style={{marginTop:4,fontWeight:500}}>{v || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
