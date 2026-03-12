import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-title">Owner Login</h1>
        <p className="auth-sub">Sign in to manage your portfolio — projects, certificates, and videos.</p>

        <form onSubmit={submit} className="auth-form">
          <div className="fgroup">
            <label className="flabel">Email Address</label>
            <input
              type="email" className="finput" placeholder="you@example.com"
              value={form.email} onChange={set('email')} required
              autoComplete="email"
            />
          </div>
          <div className="fgroup">
            <label className="flabel">Password</label>
            <input
              type="password" className="finput" placeholder="Your password"
              value={form.password} onChange={set('password')} required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            style={{ marginTop: 6 }}
            disabled={loading}
          >
            {loading ? <><span className="spin-sm" /> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:18 }}>
          <Link to="/" style={{ color:'var(--text-muted)', fontSize:13 }}>
            ← View Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
