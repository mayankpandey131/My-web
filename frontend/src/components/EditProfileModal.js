import React, { useState, useRef } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    bio: profile.bio || '',
    resumeLink: profile.resumeLink || '',
    skills: profile.skills?.join(', ') || '',
    github: profile.socialLinks?.github || '',
    linkedin: profile.socialLinks?.linkedin || '',
    twitter: profile.socialLinks?.twitter || '',
    website: profile.socialLinks?.website || ''
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const avatarRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('fullName', form.fullName);
      fd.append('bio', form.bio);
      fd.append('resumeLink', form.resumeLink);
      fd.append('skills', form.skills);
      fd.append('socialLinks', JSON.stringify({
        github: form.github, linkedin: form.linkedin,
        twitter: form.twitter, website: form.website
      }));
      if (avatar) fd.append('profilePicture', avatar);
      const res = await userAPI.updateProfile(fd);
      toast.success('Profile updated!');
      onSave(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = profile.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: '20px', background: 'var(--off-white)', borderRadius: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.4rem', color: 'white', overflow: 'hidden', flexShrink: 0, border: '3px solid white', boxShadow: 'var(--shadow-md)' }}>
                {avatar ? <img src={URL.createObjectURL(avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : profile.profilePicture ? <img src={`http://localhost:5000${profile.profilePicture}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials}
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>Profile Photo</p>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => avatarRef.current.click()}>
                  {avatar ? '🔄 Change Photo' : '📸 Upload Photo'}
                </button>
                <input type="file" ref={avatarRef} style={{ display: 'none' }} accept="image/*" onChange={e => setAvatar(e.target.files[0])} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell the world about yourself — your interests, goals, and what you're working on..." />
            </div>

            <div className="form-group">
              <label className="form-label">Resume Link</label>
              <input className="form-input" value={form.resumeLink} onChange={e => setForm(p => ({ ...p, resumeLink: e.target.value }))} placeholder="Google Drive / LinkedIn / Dropbox URL" />
            </div>

            <div className="form-group">
              <label className="form-label">Skills</label>
              <input className="form-input" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="JavaScript, Python, React, ML, Design... (comma separated)" />
            </div>

            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginBottom: 4 }}>
              <p style={{ fontWeight: 600, marginBottom: 16, fontSize: '0.9rem' }}>🔗 Social Links</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">GitHub</label>
                  <input className="form-input" value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} placeholder="https://github.com/username" />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input className="form-input" value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/username" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Twitter / X</label>
                  <input className="form-input" value={form.twitter} onChange={e => setForm(p => ({ ...p, twitter: e.target.value }))} placeholder="https://twitter.com/username" />
                </div>
                <div className="form-group">
                  <label className="form-label">Personal Website</label>
                  <input className="form-input" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://yourwebsite.com" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-accent" disabled={loading} style={{ flex: 2 }}>
                {loading ? '⏳ Saving...' : '✅ Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
