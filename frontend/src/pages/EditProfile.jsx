import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './EditProfile.css';

export default function EditProfile() {
  const { user, API, updateUser } = useAuth();
  const navigate = useNavigate();
  const [skillIn, setSkillIn] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name:'', headline:'', bio:'', location:'',
    website:'', github:'', linkedin:'', twitter:'',
    avatar:'', skills:[],
  });

  useEffect(() => {
    if (user) setForm({
      name:     user.name     || '',
      headline: user.headline || '',
      bio:      user.bio      || '',
      location: user.location || '',
      website:  user.website  || '',
      github:   user.github   || '',
      linkedin: user.linkedin || '',
      twitter:  user.twitter  || '',
      avatar:   user.avatar   || '',
      skills:   user.skills   || [],
    });
  }, [user]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const addSkill = (e) => {
    if ((e.key==='Enter'||e.key===',') && skillIn.trim()) {
      e.preventDefault();
      const s = skillIn.trim().replace(/,$/,'');
      if (s && !form.skills.includes(s)) setForm(f=>({...f,skills:[...f.skills,s]}));
      setSkillIn('');
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const r = await API.put('/profile', form);
      updateUser(r.data.user);
      toast.success('Profile saved ✅');
      navigate('/admin');
    } catch(err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="page wrap ep-page">
      <div className="ep-header">
        <div>
          <h1 className="ep-title">Edit Profile</h1>
          <p className="ep-sub">Update your public portfolio information</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')}>← Back</button>
      </div>

      <div className="ep-layout">

        {/* PREVIEW */}
        <div className="ep-preview">
          <div className="ep-preview-av">
            {form.avatar
              ? <img src={form.avatar} alt="preview" onError={e=>e.target.style.display='none'}/>
              : <span>{form.name?.charAt(0)?.toUpperCase()||'?'}</span>
            }
          </div>
          <div className="ep-preview-name">{form.name||'Your Name'}</div>
          {form.headline && <div className="ep-preview-hl">{form.headline}</div>}
          {form.location && <div className="ep-preview-loc">📍 {form.location}</div>}
          {form.bio && <div className="ep-preview-bio">{form.bio.slice(0,100)}{form.bio.length>100?'...':''}</div>}
          {form.skills.length>0 && (
            <div className="chips" style={{justifyContent:'center', marginTop:10}}>
              {form.skills.slice(0,5).map(s=><span key={s} className="chip chip-purple">{s}</span>)}
            </div>
          )}
          <div className="ep-preview-label">Live Preview</div>
        </div>

        {/* FORM */}
        <form onSubmit={save} className="ep-form">
          <div className="ep-section">
            <h3 className="ep-section-title">Basic Info</h3>
            <div className="fgroup">
              <label className="flabel">Full Name *</label>
              <input className="finput" placeholder="Mayank Sharma" value={form.name} onChange={set('name')} required/>
            </div>
            <div className="fgroup">
              <label className="flabel">Headline</label>
              <input className="finput" placeholder="Full Stack Developer · React & Node.js" value={form.headline} onChange={set('headline')}/>
            </div>
            <div className="fgroup">
              <label className="flabel">Bio</label>
              <textarea className="ftextarea" placeholder="Tell visitors about yourself..." value={form.bio} onChange={set('bio')}/>
            </div>
            <div className="fgroup">
              <label className="flabel">Location</label>
              <input className="finput" placeholder="Mumbai, India" value={form.location} onChange={set('location')}/>
            </div>
            <div className="fgroup">
              <label className="flabel">Avatar Image URL</label>
              <input className="finput" placeholder="https://your-photo.com/pic.jpg" value={form.avatar} onChange={set('avatar')}/>
            </div>
          </div>

          <div className="ep-section">
            <h3 className="ep-section-title">Social Links</h3>
            <div className="fgroup">
              <label className="flabel">GitHub</label>
              <input className="finput" placeholder="https://github.com/yourusername" value={form.github} onChange={set('github')}/>
            </div>
            <div className="fgroup">
              <label className="flabel">LinkedIn</label>
              <input className="finput" placeholder="https://linkedin.com/in/yourusername" value={form.linkedin} onChange={set('linkedin')}/>
            </div>
            <div className="fgroup">
              <label className="flabel">Website</label>
              <input className="finput" placeholder="https://yourwebsite.com" value={form.website} onChange={set('website')}/>
            </div>
            <div className="fgroup">
              <label className="flabel">Twitter / X</label>
              <input className="finput" placeholder="https://twitter.com/yourhandle" value={form.twitter} onChange={set('twitter')}/>
            </div>
          </div>

          <div className="ep-section">
            <h3 className="ep-section-title">Skills</h3>
            <div className="fgroup">
              <label className="flabel">Add Skills (press Enter or comma)</label>
              <input className="finput" placeholder="JavaScript, React, Python..." value={skillIn} onChange={e=>setSkillIn(e.target.value)} onKeyDown={addSkill}/>
              {form.skills.length>0 && (
                <div className="chips" style={{marginTop:8}}>
                  {form.skills.map(s=>(
                    <span key={s} className="tag-pill">{s}
                      <button type="button" className="tag-x" onClick={()=>setForm(f=>({...f,skills:f.skills.filter(x=>x!==s)}))}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ep-actions">
            <button type="button" className="btn btn-ghost" onClick={()=>navigate('/admin')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
              {saving?<><span className="spin-sm"/> Saving...</>:'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
