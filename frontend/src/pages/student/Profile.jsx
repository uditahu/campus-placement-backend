import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function StudentProfile() {
  const { API } = useAuth();
  const [form, setForm]     = useState({});
  const [file, setFile]     = useState(null);
  const [msg, setMsg]       = useState({ type:'', text:'' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/student/profile`, { credentials: 'include' })
      .then(r => r.json()).then(d => setForm(d)).catch(() => {});
  }, []);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async e => {
    e.preventDefault(); setSaving(true); setMsg({type:'',text:''});
    try {
      const res  = await fetch(`${API}/api/student/profile`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(form),
      });
      const data = await res.json();
      setMsg({ type: res.ok ? 'success' : 'error', text: data.message });
    } catch { setMsg({ type:'error', text:'Failed to save.' }); }
    finally { setSaving(false); }
  };

  const uploadResume = async () => {
    if (!file) return;
    setUploading(true); setMsg({type:'',text:''});
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const res  = await fetch(`${API}/api/student/resume`, {
        method: 'POST', credentials: 'include', body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setForm(p => ({ ...p, resume_url: data.resume_url }));
        setMsg({ type:'success', text:'Resume uploaded successfully!' });
        setFile(null);
      } else {
        setMsg({ type:'error', text: data.message });
      }
    } catch { setMsg({ type:'error', text:'Upload failed.' }); }
    finally { setUploading(false); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Keep your profile updated to improve your chances</p>
        </div>
        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="card">
          <div className="card-title">Personal & Academic Details</div>
          <form onSubmit={saveProfile}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name||''} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={form.email||''} disabled style={{background:'#f8fafc'}} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>College ID</label>
                <input name="college_id" value={form.college_id||''} onChange={handle} placeholder="e.g. 21CE001" />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <select name="branch" value={form.branch||''} onChange={handle}>
                  <option value="">Select branch</option>
                  {['Computer Engineering','Information Technology','Electronics',
                    'Mechanical','Civil','Electrical'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>CGPA</label>
                <input name="cgpa" type="number" step="0.01" min="0" max="10"
                  value={form.cgpa||''} onChange={handle} placeholder="e.g. 8.5" />
              </div>
              <div className="form-group">
                <label>Year</label>
                <select name="year" value={form.year||''} onChange={handle}>
                  <option value="">Select year</option>
                  {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone||''} onChange={handle} placeholder="10-digit" />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input name="linkedin" value={form.linkedin||''} onChange={handle} placeholder="linkedin.com/in/..." />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>GitHub</label>
                <input name="github" value={form.github||''} onChange={handle} placeholder="github.com/..." />
              </div>
              <div className="form-group">
                <label>Skills</label>
                <input name="skills" value={form.skills||''} onChange={handle} placeholder="React, Node.js, Python…" />
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" rows="3" value={form.bio||''} onChange={handle}
                placeholder="Brief description about yourself…" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Resume (PDF only, max 5MB)</div>
          {form.resume_url ? (
            <div className="alert alert-success" style={{marginBottom:16}}>
              ✅ Resume uploaded. &nbsp;
              <a href={form.resume_url} target="_blank" rel="noreferrer"
                style={{fontWeight:700}}>View / Download</a>
            </div>
          ) : (
            <div className="alert alert-info" style={{marginBottom:16}}>
              No resume uploaded yet.
            </div>
          )}
          <div className="resume-box">
            <p>{form.resume_url ? 'Upload a new resume to replace the existing one' : 'Upload your resume to apply for jobs'}</p>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
              style={{marginBottom:12}} />
            <br />
            <button className="btn btn-primary" onClick={uploadResume}
              disabled={!file || uploading}>
              {uploading ? 'Uploading…' : '⬆️ Upload to S3'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
