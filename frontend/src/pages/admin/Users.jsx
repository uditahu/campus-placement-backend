import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function AdminUsers() {
  const { API } = useAuth();
  const [users, setUsers]   = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [show, setShow]     = useState(false);
  const [form, setForm]     = useState({ name:'', email:'', password:'', role:'student' });
  const [msg,  setMsg]      = useState({ type:'', text:'' });

  const load = () => fetch(`${API}/api/admin/users`, { credentials:'include' })
    .then(r=>r.json()).then(d=>setUsers(Array.isArray(d)?d:[])).catch(()=>{});

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    const res = await fetch(`${API}/api/admin/users/${id}`, { method:'DELETE', credentials:'include' });
    if (res.ok) load();
  };

  const createUser = async e => {
    e.preventDefault(); setMsg({type:'',text:''});
    const res  = await fetch(`${API}/api/admin/create-user`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify(form),
    });
    const data = await res.json();
    setMsg({ type: res.ok?'success':'error', text: data.message });
    if (res.ok) { load(); setShow(false); setForm({name:'',email:'',password:'',role:'student'}); }
  };

  const visible = users.filter(u =>
    (filter==='all' || u.role===filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>All Users</h1><p>{users.length} registered users</p></div>
        <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
          <input placeholder="Search name or email…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{padding:'8px 13px',border:'1px solid var(--border)',borderRadius:6,fontSize:14,flex:1,minWidth:200}} />
          {['all','student','faculty','company','admin'].map(r => (
            <button key={r} className={`btn btn-sm ${filter===r?'btn-primary':'btn-outline'}`}
              onClick={()=>setFilter(r)} style={{textTransform:'capitalize'}}>{r}</button>
          ))}
          <button className="btn btn-success btn-sm" onClick={()=>setShow(true)}>+ Create User</button>
        </div>

        {show && (
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
            <div className="modal">
              <div className="modal-header">
                <h2>Create New User</h2>
                <button className="modal-close" onClick={()=>setShow(false)}>×</button>
              </div>
              {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
              <form onSubmit={createUser}>
                {[['Name','name','text','Full name'],['Email','email','email','user@example.com'],
                  ['Password','password','password','Set password']].map(([l,n,t,p]) => (
                  <div key={n} className="form-group">
                    <label>{l}</label>
                    <input name={n} type={t} placeholder={p} required
                      value={form[n]} onChange={e=>setForm(p=>({...p,[n]:e.target.value}))} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Role</label>
                  <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                    {['student','faculty','company','admin'].map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Create User</button>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan="5" className="no-data">No users found.</td></tr>
                ) : visible.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(u.id)}>Delete</button>
                    </td>
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
