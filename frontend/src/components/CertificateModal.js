import React, { useState, useRef } from 'react';
import { certificateAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function CertificateModal({ editData, onClose, onSave }) {
  const [form, setForm] = useState({
    title: editData?.title || '',
    issuedBy: editData?.issuedBy || '',
    description: editData?.description || '',
    issueDate: editData?.issueDate ? editData.issueDate.slice(0, 10) : '',
    expiryDate: editData?.expiryDate ? editData.expiryDate.slice(0, 10) : '',
    credentialId: editData?.credentialId || '',
    credentialUrl: editData?.credentialUrl || '',
    skills: editData?.skills?.join(', ') || ''
  });
  const [certFile, setCertFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Certificate title is required';
    if (!form.issuedBy.trim()) e.issuedBy = 'Issuing organization is required';
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
      if (certFile) fd.append('certificateFile', certFile);

      let res;
      if (editData) res = await certificateAPI.update(editData._id, fd);
      else res = await certificateAPI.create(fd);

      toast.success(editData ? 'Certificate updated!' : 'Certificate added!');
      onSave(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editData ? '✏️ Edit Certificate' : '🏆 Add Certificate'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Certificate Title <span className="required">*</span></label>
              <input className={`form-input ${errors.title ? 'error' : ''}`} value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. AWS Cloud Practitioner, React Developer Certification..." />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Issued By <span className="required">*</span></label>
              <input className={`form-input ${errors.issuedBy ? 'error' : ''}`} value={form.issuedBy}
                onChange={e => setForm(p => ({ ...p, issuedBy: e.target.value }))}
                placeholder="e.g. Amazon Web Services, Coursera, NPTEL, Google..." />
              {errors.issuedBy && <p className="form-error">{errors.issuedBy}</p>}
            </div>

            {/* Description - prominent section */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Describe what you learned, the topics covered, why this certificate matters to you..."
                style={{ minHeight: 110 }} />
              <p className="form-hint">Share what you learned and how it benefits your career</p>
            </div>

            {/* Certificate File Upload */}
            <div className="form-group">
              <label className="form-label">Upload Certificate Image / PDF</label>
              <div className="upload-zone" onClick={() => fileRef.current.click()}>
                {certFile ? (
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>
                      {certFile.type.includes('pdf') ? '📄' : '🖼️'}
                    </div>
                    <p><strong>{certFile.name}</strong></p>
                    <p style={{ fontSize: '0.78rem' }}>{(certFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                  </div>
                ) : editData?.certificateFile ? (
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>📎</div>
                    <p><strong>Certificate already uploaded</strong></p>
                    <p style={{ fontSize: '0.78rem' }}>Click to replace with a new file</p>
                  </div>
                ) : (
                  <div>
                    <div className="upload-zone-icon">🏅</div>
                    <p><strong>Click to upload certificate</strong></p>
                    <p>JPG, PNG or PDF · Max 10MB</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileRef} style={{ display: 'none' }}
                accept="image/*,.pdf" onChange={e => setCertFile(e.target.files[0])} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input type="date" className="form-input" value={form.issueDate}
                  onChange={e => setForm(p => ({ ...p, issueDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>(if any)</span></label>
                <input type="date" className="form-input" value={form.expiryDate}
                  onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Credential ID</label>
              <input className="form-input" value={form.credentialId}
                onChange={e => setForm(p => ({ ...p, credentialId: e.target.value }))}
                placeholder="Certificate/Credential ID number" />
            </div>

            <div className="form-group">
              <label className="form-label">Verification URL</label>
              <input className="form-input" value={form.credentialUrl}
                onChange={e => setForm(p => ({ ...p, credentialUrl: e.target.value }))}
                placeholder="https://verify.credential.com/..." />
              <p className="form-hint">Link to verify this certificate online</p>
            </div>

            <div className="form-group">
              <label className="form-label">Skills Learned</label>
              <input className="form-input" value={form.skills}
                onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                placeholder="Cloud Computing, AWS, DevOps... (comma separated)" />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-accent" disabled={loading} style={{ flex: 2 }}>
                {loading ? '⏳ Saving...' : editData ? '✅ Update Certificate' : '🏅 Add Certificate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
