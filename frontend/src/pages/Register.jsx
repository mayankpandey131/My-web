import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())     return toast.error('Name is required');
    if (!form.email.trim())    return toast.error('Email is required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-badge">✦ First Time Setup</div>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-sub">
          Set up your portfolio account. This registration page is only available once —
          after this, only you can log in to manage your portfolio.
        </p>

        <form onSubmit={submit} className="auth-form">
          <div className="fgroup">
            <label className="flabel">Your Name</label>
            <input
              className="finput" placeholder="e.g. Mayank Sharma"
              value={form.name} onChange={set('name')} required
              autoComplete="name"
            />
          </div>
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
              type="password" className="finput" placeholder="Min. 6 characters"
              value={form.password} onChange={set('password')} required
              autoComplete="new-password"
            />
          </div>
          <div className="fgroup">
            <label className="flabel">Confirm Password</label>
            <input
              type="password" className="finput" placeholder="Repeat your password"
              value={form.confirm} onChange={set('confirm')} required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            style={{ marginTop: 6 }}
            disabled={loading}
          >
            {loading ? <><span className="spin-sm" /> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p style={{ color:'var(--text-muted)', fontSize:12, textAlign:'center', marginTop:16, lineHeight:1.5 }}>
          🔒 This page disappears after registration. Visitors will only see your public portfolio.
        </p>
      </div>
    </div>
  );
}
