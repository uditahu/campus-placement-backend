import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function AdminDashboard() {
  const { API } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { credentials:'include' }).then(r=>r.json()).then(setStats).catch(()=>{});
    fetch(`${API}/api/admin/users`, { credentials:'include' }).then(r=>r.json())
      .then(d => setUsers(Array.isArray(d)?d.slice(0,8):[])).catch(()=>{});
  }, []);

  const STAT_ITEMS = [
    ['👨‍🎓', stats.students,    'Students'],
    ['🏫',  stats.faculty,     'Faculty'],
    ['🏢',  stats.companies,   'Companies'],
    ['💼',  stats.jobs,        'Open Jobs'],
    ['📋',  stats.applications,'Applications'],
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>Admin Dashboard</h1><p>System-wide overview</p></div>
        <div className="stats-grid">
          {STAT_ITEMS.map(([icon,val,label]) => (
            <div key={label} className="stat-card">
              <div style={{fontSize:28}}>{icon}</div>
              <div className="stat-number">{val ?? '—'}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Recently Registered Users</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
