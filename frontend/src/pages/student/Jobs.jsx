import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function StudentJobs() {
  const { API } = useAuth();
  const [jobs, setJobs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]     = useState({ id: null, type:'', text:'' });

  useEffect(() => {
    fetch(`${API}/api/student/jobs`, { credentials: 'include' })
      .then(r => r.json()).then(d => setJobs(Array.isArray(d)?d:[])).finally(() => setLoading(false));
  }, []);

  const apply = async (jobId) => {
    setMsg({ id: jobId, type:'', text:'' });
    const res  = await fetch(`${API}/api/student/jobs/${jobId}/apply`, {
      method: 'POST', credentials: 'include',
    });
    const data = await res.json();
    setMsg({ id: jobId, type: res.ok ? 'success' : 'error', text: data.message });
    if (res.ok) setJobs(p => p.map(j => j.id===jobId ? {...j, applied:1} : j));
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Browse Jobs</h1>
          <p>{jobs.length} open position{jobs.length!==1?'s':''} available</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          jobs.length === 0 ? (
            <div className="card" style={{textAlign:'center',padding:60}}>
              <p style={{fontSize:40}}>💼</p>
              <p style={{color:'var(--muted)',marginTop:8}}>No open jobs at the moment. Check back later.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(j => (
                <div key={j.id} className="job-card">
                  <div>
                    <h3>{j.title}</h3>
                    <div className="job-co">🏢 {j.company_name} · {j.industry}</div>
                  </div>
                  <div className="job-tags">
                    {j.vacancies && <span className="job-tag">👥 {j.vacancies} vacancies</span>}
                    {j.min_cgpa > 0 && <span className="job-tag">📊 Min CGPA {j.min_cgpa}</span>}
                    {j.deadline && <span className="job-tag">📅 {new Date(j.deadline).toLocaleDateString()}</span>}
                  </div>
                  {j.description && (
                    <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.5}}>
                      {j.description.substring(0,120)}{j.description.length>120?'…':''}
                    </p>
                  )}
                  {msg.id===j.id && msg.text && (
                    <div className={`alert alert-${msg.type}`} style={{margin:0}}>{msg.text}</div>
                  )}
                  <div className="job-footer">
                    <span className={`badge badge-${j.status}`}>{j.status}</span>
                    <button
                      className={`btn btn-sm ${j.applied ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => apply(j.id)}
                      disabled={!!j.applied}>
                      {j.applied ? '✅ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
