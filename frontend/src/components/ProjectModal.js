import React, { useState, useRef } from 'react';
import { projectAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function ProjectModal({ editData, onClose, onSave }) {
  const [form, setForm] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    technologies: editData?.technologies?.join(', ') || '',
    videoUrl: editData?.videoUrl || '',
    githubLink: editData?.githubLink || '',
    liveLink: editData?.liveLink || '',
    featured: editData?.featured || false
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const thumbRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Project title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (thumbnail) fd.append('thumbnail', thumbnail);

      let res;
      if (editData) res = await projectAPI.update(editData._id, fd);
      else res = await projectAPI.create(fd);

      toast.success(editData ? 'Project updated!' : 'Project added!');
      onSave(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editData ? '✏️ Edit Project' : '💼 Add New Project'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title <span className="required">*</span></label>
              <input className={`form-input ${errors.title ? 'error' : ''}`} value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. E-commerce Website, Chat App..." />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Description <span className="required">*</span></label>
              <textarea className={`form-textarea ${errors.description ? 'error' : ''}`} value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe what your project does, the problem it solves, and key features..."
                style={{ minHeight: 120 }} />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Technologies Used</label>
              <input className="form-input" value={form.technologies}
                onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))}
                placeholder="React, Node.js, MongoDB, Python... (comma separated)" />
            </div>

            {/* Thumbnail */}
            <div className="form-group">
              <label className="form-label">Project Thumbnail</label>
              <div className="upload-zone" onClick={() => thumbRef.current.click()}>
                {thumbnail ? (
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🖼️</div>
                    <p><strong>{thumbnail.name}</strong></p>
                    <p style={{ fontSize: '0.78rem' }}>{(thumbnail.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <div className="upload-zone-icon">🖼️</div>
                    <p><strong>Click to upload thumbnail</strong></p>
                    <p>PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <input type="file" ref={thumbRef} style={{ display: 'none' }} accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
            </div>

            <div className="form-group">
              <label className="form-label">🎥 Video URL</label>
              <input className="form-input" value={form.videoUrl}
                onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
                placeholder="YouTube link: https://youtube.com/watch?v=..." />
              <p className="form-hint">Paste a YouTube URL to embed a demo video</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">GitHub Link</label>
                <input className="form-input" value={form.githubLink}
                  onChange={e => setForm(p => ({ ...p, githubLink: e.target.value }))}
                  placeholder="https://github.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Live Demo Link</label>
                <input className="form-input" value={form.liveLink}
                  onChange={e => setForm(p => ({ ...p, liveLink: e.target.value }))}
                  placeholder="https://yourapp.vercel.app" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-accent" disabled={loading} style={{ flex: 2 }}>
                {loading ? '⏳ Saving...' : editData ? '✅ Update Project' : '🚀 Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
