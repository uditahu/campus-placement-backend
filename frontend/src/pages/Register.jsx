import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = ['student','faculty','company'];

export default function Register() {
  const { API } = useAuth();
  const navigate = useNavigate();
  const [role, setRole]     = useState('student');
  const [form, setForm]     = useState({});
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/register`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{fontSize:42}}>🎓</div>
          <h1>Create Account</h1>
          <p>Register for Campus Placement Portal</p>
        </div>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="role-tabs">
          {ROLES.map(r => (
            <button key={r} type="button"
              className={`role-tab${role===r?' active':''}`}
              onClick={() => setRole(r)}>
              {r==='student'?'👨‍🎓 Student':r==='faculty'?'🏫 Faculty':'🏢 Company'}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="Your full name" onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" placeholder="email@example.com" onChange={handle} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Min 6 characters" onChange={handle} required />
          </div>

          {role === 'student' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>College ID</label>
                  <input name="college_id" placeholder="e.g. 21CE001" onChange={handle} />
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" onChange={handle}>
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
                  <label>Year</label>
                  <select name="year" onChange={handle}>
                    <option value="">Select year</option>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" placeholder="10-digit number" onChange={handle} />
                </div>
              </div>
            </>
          )}

          {role === 'faculty' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input name="employee_id" placeholder="EMP001" onChange={handle} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input name="department" placeholder="Computer Engineering" onChange={handle} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <input name="position" placeholder="Assistant Professor" onChange={handle} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" placeholder="10-digit number" onChange={handle} />
                </div>
              </div>
            </>
          )}

          {role === 'company' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input name="company_name" placeholder="Acme Corp" onChange={handle} />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <input name="industry" placeholder="IT / Finance / Core" onChange={handle} />
                </div>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input name="website" placeholder="https://company.com" onChange={handle} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}}
            disabled={loading}>
            {loading ? 'Registering…' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
