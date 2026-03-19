import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const DEGREES = ['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'BCA', 'BBA', 'B.A.', 'M.Tech', 'M.E.', 'M.Sc', 'MCA', 'MBA', 'M.A.', 'Ph.D', 'Diploma'];
const STREAMS = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Chemical Engineering', 'Biotechnology', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Business Administration', 'Commerce', 'Physics', 'Mathematics', 'Other'];
const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + 5 - i);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [collegeVerifyStatus, setCollegeVerifyStatus] = useState(null);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
    collegeName: '', degree: '', stream: '', passingYear: '', resumeLink: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    authAPI.getColleges().then(res => setColleges(res.data.colleges));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'collegeName') {
      if (value.length > 1) {
        const filtered = colleges.filter(c => c.toLowerCase().includes(value.toLowerCase()));
        setFilteredColleges(filtered.slice(0, 8));
        setShowDropdown(true);
        const exact = colleges.find(c => c.toLowerCase() === value.toLowerCase());
        setCollegeVerifyStatus(exact ? 'verified' : 'unverified');
      } else {
        setFilteredColleges([]); setShowDropdown(false); setCollegeVerifyStatus(null);
      }
    }
  };

  const selectCollege = (name) => {
    setForm(prev => ({ ...prev, collegeName: name }));
    setCollegeVerifyStatus('verified');
    setShowDropdown(false);
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.username.trim()) e.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) e.username = 'Username: 3-20 chars, letters/numbers/_';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.collegeName.trim()) e.collegeName = 'College name is required';
    if (!form.degree) e.degree = 'Degree is required';
    if (!form.stream) e.stream = 'Stream is required';
    if (!form.passingYear) e.passingYear = 'Passing year is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const res = await register({
        fullName: form.fullName, username: form.username, email: form.email,
        password: form.password, collegeName: form.collegeName,
        degree: form.degree, stream: form.stream,
        passingYear: parseInt(form.passingYear),
        resumeLink: form.resumeLink
      });
      toast.success('🎉 Account created! Welcome to My-Web!');
      navigate(`/profile/${res.user.username}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div>
          <div className="auth-brand">My-<span>Web</span></div>
          <p className="auth-tagline">Build your professional identity. Showcase your work, achievements, and academic journey.</p>
          <div className="auth-features">
            {[
              { icon: '💼', title: 'Showcase Projects', desc: 'Upload your projects with videos, descriptions and GitHub links' },
              { icon: '🏆', title: 'Post Certificates', desc: 'Share your certifications with images and credentials' },
              { icon: '🎓', title: 'College Verification', desc: 'Get verified badge for recognized institutions' },
              { icon: '🌍', title: 'Public Portfolio', desc: 'Share your profile with recruiters and the world' }
            ].map(f => (
              <div className="auth-feature" key={f.title}>
                <div className="auth-feature-icon">{f.icon}</div>
                <div className="auth-feature-text">
                  <strong>{f.title}</strong>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          © 2024 My-Web · Professional Portfolio Platform
        </div>
      </div>

      {/* Right Form */}
      <div className="auth-right">
        <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: s <= step ? 'var(--accent)' : 'var(--gray-200)',
                  color: s <= step ? 'white' : 'var(--gray-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.3s ease'
                }}>{s <= step && s < step ? '✓' : s}</div>
                {s < 2 && <div style={{ flex: 1, height: 2, background: step > s ? 'var(--accent)' : 'var(--gray-200)', borderRadius: 4, transition: 'all 0.3s ease' }} />}
              </React.Fragment>
            ))}
            <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginLeft: 8 }}>Step {step} of 2</span>
          </div>

          {step === 1 ? (
            <>
              <h1 className="auth-form-title">Create Account</h1>
              <p className="auth-form-sub">Start building your professional portfolio</p>
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input className={`form-input ${errors.fullName ? 'error' : ''}`} name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Arjun Sharma" />
                  {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Username <span className="required">*</span></label>
                    <input className={`form-input ${errors.username ? 'error' : ''}`} name="username" value={form.username} onChange={handleChange} placeholder="arjun_sharma" />
                    {errors.username ? <p className="form-error">{errors.username}</p> : <p className="form-hint">my-web.com/@{form.username || 'username'}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <input className={`form-input ${errors.email ? 'error' : ''}`} name="email" value={form.email} onChange={handleChange} placeholder="arjun@email.com" type="email" />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password <span className="required">*</span></label>
                    <input className={`form-input ${errors.password ? 'error' : ''}`} name="password" value={form.password} onChange={handleChange} type="password" placeholder="Min 6 chars" />
                    {errors.password && <p className="form-error">{errors.password}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <input className={`form-input ${errors.confirmPassword ? 'error' : ''}`} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Repeat password" />
                    {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
                  </div>
                </div>
                <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: 8 }}>
                  Continue → Academic Details
                </button>
              </form>
              <div className="auth-form-footer">
                Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="auth-form-title">Academic Details</h1>
              <p className="auth-form-sub">Tell us about your education background</p>
              <form onSubmit={handleSubmit}>
                {/* College with autocomplete */}
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">College / University <span className="required">*</span></label>
                  <input
                    className={`form-input ${errors.collegeName ? 'error' : ''}`}
                    name="collegeName" value={form.collegeName} onChange={handleChange}
                    placeholder="Start typing your college name..."
                    autoComplete="off"
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                  {showDropdown && filteredColleges.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'white', border: '1.5px solid var(--gray-200)',
                      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                      zIndex: 50, maxHeight: 220, overflowY: 'auto'
                    }}>
                      {filteredColleges.map(c => (
                        <div key={c} onMouseDown={() => selectCollege(c)} style={{
                          padding: '10px 16px', cursor: 'pointer', fontSize: '0.88rem',
                          transition: 'background 0.1s', borderBottom: '1px solid var(--gray-100)'
                        }}
                          onMouseEnter={e => e.target.style.background = 'var(--accent-pale)'}
                          onMouseLeave={e => e.target.style.background = 'white'}
                        >{c}</div>
                      ))}
                    </div>
                  )}
                  {errors.collegeName && <p className="form-error">{errors.collegeName}</p>}
                  {collegeVerifyStatus === 'verified' && (
                    <div className="college-verify verified">✅ Verified College — You'll get a verified badge</div>
                  )}
                  {collegeVerifyStatus === 'unverified' && form.collegeName.length > 2 && (
                    <div className="college-verify unverified">⚠️ College not in our verified list — account still created</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Degree <span className="required">*</span></label>
                    <select className={`form-select ${errors.degree ? 'error' : ''}`} name="degree" value={form.degree} onChange={handleChange}>
                      <option value="">Select degree</option>
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.degree && <p className="form-error">{errors.degree}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stream <span className="required">*</span></label>
                    <select className={`form-select ${errors.stream ? 'error' : ''}`} name="stream" value={form.stream} onChange={handleChange}>
                      <option value="">Select stream</option>
                      {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.stream && <p className="form-error">{errors.stream}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Passing Year <span className="required">*</span></label>
                  <select className={`form-select ${errors.passingYear ? 'error' : ''}`} name="passingYear" value={form.passingYear} onChange={handleChange}>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.passingYear && <p className="form-error">{errors.passingYear}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Resume Link <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>(optional)</span></label>
                  <input className="form-input" name="resumeLink" value={form.resumeLink} onChange={handleChange} placeholder="https://drive.google.com/your-resume or LinkedIn URL" />
                  <p className="form-hint">Google Drive, Dropbox, or any public resume URL</p>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
                  <button type="submit" className="btn btn-accent" disabled={loading} style={{ flex: 2 }}>
                    {loading ? '⏳ Creating Account...' : '🚀 Create My Account'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
