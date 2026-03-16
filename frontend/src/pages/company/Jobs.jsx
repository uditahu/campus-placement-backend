import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const EMPTY = { title:'', description:'', vacancies:1, criteria:'', min_cgpa:0, deadline:'' };

export default function CompanyJobs() {
  const { API } = useAuth();
  const [jobs, setJobs]   = useState([]);
  const [show, setShow]   = useState(false);
  const [form, setForm]   = useState(EMPTY);
  const [msg,  setMsg]    = useState({ type:'', text:'' });
  const [saving, setSaving] = useState(false);

  const load = () => fetch(`${API}/api/company/jobs`, { credentials: 'include' })
    .then(r => r.json()).then(d => setJobs(Array.isArray(d)?d:[])).catch(() => {});

  useEffect(() => { load(); }, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setSaving(true); setMsg({type:'',text:''});
    try {
      const res  = await fetch(`${API}/api/company/jobs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(form),
      });
      const data = await res.json();
      setMsg({ type: res.ok?'success':'error', text: data.message });
      if (res.ok) { setForm(EMPTY); load(); setShow(false); }
    } catch { setMsg({ type:'error', text:'Failed.' }); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this job?')) return;
    await fetch(`${API}/api/company/jobs/${id}`, { method:'DELETE', credentials:'include' });
    load();
  };

  const toggle = async (j) => {
    await fetch(`${API}/api/company/jobs/${j.id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, credentials:'include',
      body: JSON.stringify({ ...j, status: j.status==='open'?'closed':'open' }),
    });
    load();
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Manage Jobs</h1>
        </div>
        <div style={{marginBottom:20}}>
          <button className="btn btn-primary" onClick={() => setShow(true)}>+ Post New Job</button>
        </div>

        {show && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShow(false)}>
            <div className="modal">
              <div className="modal-header">
                <h2>Post a New Job</h2>
                <button className="modal-close" onClick={() => setShow(false)}>×</button>
              </div>
              {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <form onSubmit={submit}>
                <div className="form-group">
                  <label>Job Title *</label>
                  <input name="title" value={form.title} onChange={handle} required placeholder="e.g. Software Engineer" />
                </div>
                <div className="form-group">
                  <label>Job Description</label>
                  <textarea name="description" rows="3" value={form.description} onChange={handle}
                    placeholder="Describe the role, responsibilities…" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vacancies</label>
                    <input name="vacancies" type="number" min="1" value={form.vacancies} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>Min CGPA</label>
                    <input name="min_cgpa" type="number" step="0.01" min="0" max="10"
                      value={form.min_cgpa} onChange={handle} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Eligibility Criteria</label>
                    <input name="criteria" value={form.criteria} onChange={handle}
                      placeholder="e.g. B.Tech CS/IT" />
                  </div>
                  <div className="form-group">
                    <label>Application Deadline</label>
                    <input name="deadline" type="date" value={form.deadline} onChange={handle} />
                  </div>
                </div>
                <div style={{display:'flex',gap:10,marginTop:4}}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Posting…' : 'Post Job'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setShow(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          {jobs.length === 0 ? (
            <div className="no-data">No jobs posted yet. Click &quot;Post New Job&quot; to get started.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Title</th><th>Vacancies</th><th>Min CGPA</th><th>Deadline</th>
                  <th>Applicants</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.vacancies}</td>
                      <td>{j.min_cgpa||'—'}</td>
                      <td>{j.deadline ? new Date(j.deadline).toLocaleDateString() : '—'}</td>
                      <td>{j.applicants_count}</td>
                      <td><span className={`badge badge-${j.status}`}>{j.status}</span></td>
                      <td style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        <Link to={`/company/jobs/${j.id}/applicants`}
                          className="btn btn-outline btn-sm">👥 Applicants</Link>
                        <button className="btn btn-sm btn-outline" onClick={() => toggle(j)}>
                          {j.status==='open'?'Close':'Reopen'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(j.id)}>Delete</button>
                      </td>
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
