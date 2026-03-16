import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const map = { student:'/student/dashboard', faculty:'/faculty/dashboard',
                    company:'/company/dashboard', admin:'/admin/dashboard' };
      navigate(map[user.role] || '/');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{fontSize:42}}>🎓</div>
          <h1>Campus Placement Portal</h1>
          <p>University Campus Online Automation</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}}
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
