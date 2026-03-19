import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!form.emailOrUsername) e2.emailOrUsername = 'Required';
    if (!form.password) e2.password = 'Required';
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      const res = await login(form);
      toast.success(`Welcome back, ${res.user.fullName}! 👋`);
      navigate(`/profile/${res.user.username}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div>
          <div className="auth-brand">My-<span>Web</span></div>
          <p className="auth-tagline">Your professional portfolio, your story. Sign in to manage your projects, certificates, and profile.</p>
          <div className="auth-features" style={{ marginTop: 60 }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.06)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>FROM OUR COMMUNITY</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                "My-Web helped me get my first internship. Recruiters could see all my projects in one place."
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: 12 }}>— Priya M., CS Student</p>
            </div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>© 2024 My-Web</div>
      </div>

      <div className="auth-right">
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-sub">Sign in to your My-Web account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input
                className={`form-input ${errors.emailOrUsername ? 'error' : ''}`}
                name="emailOrUsername" value={form.emailOrUsername}
                onChange={handleChange} placeholder="your@email.com or username"
              />
              {errors.emailOrUsername && <p className="form-error">{errors.emailOrUsername}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                name="password" value={form.password}
                onChange={handleChange} type="password" placeholder="Your password"
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: 8, padding: '14px' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="auth-form-footer" style={{ marginTop: 24 }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one free</Link>
          </div>

          {/* Demo hint */}
          <div style={{
            marginTop: 32, padding: '16px 20px',
            background: 'var(--accent-pale)', borderRadius: 12,
            border: '1px solid rgba(37,99,235,0.15)'
          }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 500 }}>
              💡 <strong>First time?</strong> Create an account to start building your portfolio. It's free!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
