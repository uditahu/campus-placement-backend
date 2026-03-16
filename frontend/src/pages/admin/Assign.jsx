import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function AdminAssign() {
  const { API } = useAuth();
  const [faculty,  setFaculty]  = useState([]);
  const [students, setStudents] = useState([]);
  const [sel, setSel]           = useState({ faculty_id:'', student_id:'' });
  const [msg, setMsg]           = useState({ type:'', text:'' });

  useEffect(() => {
    fetch(`${API}/api/admin/faculty`,  { credentials:'include' }).then(r=>r.json())
      .then(d=>setFaculty(Array.isArray(d)?d:[])).catch(()=>{});
    fetch(`${API}/api/admin/students`, { credentials:'include' }).then(r=>r.json())
      .then(d=>setStudents(Array.isArray(d)?d:[])).catch(()=>{});
  }, []);

  const assign = async e => {
    e.preventDefault();
    if (!sel.faculty_id || !sel.student_id)
      return setMsg({ type:'error', text:'Select both faculty and student.' });
    setMsg({type:'',text:''});
    const res  = await fetch(`${API}/api/admin/assign`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify(sel),
    });
    const data = await res.json();
    setMsg({ type: res.ok?'success':'error', text: data.message });
    if (res.ok) setSel({ faculty_id:'', student_id:'' });
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Assign Students to Faculty</h1>
          <p>Route student data to placement faculty members</p>
        </div>
        <div className="card" style={{maxWidth:520}}>
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
          <form onSubmit={assign}>
            <div className="form-group">
              <label>Select Faculty</label>
              <select value={sel.faculty_id}
                onChange={e=>setSel(p=>({...p,faculty_id:e.target.value}))} required>
                <option value="">— Choose Faculty Member —</option>
                {faculty.map(f => (
                  <option key={f.faculty_id} value={f.faculty_id}>
                    {f.name} {f.department ? `· ${f.department}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Student</label>
              <select value={sel.student_id}
                onChange={e=>setSel(p=>({...p,student_id:e.target.value}))} required>
                <option value="">— Choose Student —</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name} {s.branch ? `· ${s.branch}` : ''} {s.cgpa ? `· CGPA ${s.cgpa}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">🔗 Assign Student</button>
          </form>
        </div>
      </main>
    </div>
  );
}
