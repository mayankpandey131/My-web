import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, projectAPI, certificateAPI } from '../services/api';
import { toast } from 'react-toastify';
import ProjectModal from '../components/ProjectModal';
import CertificateModal from '../components/CertificateModal';
import EditProfileModal from '../components/EditProfileModal';

const API_BASE = 'http://localhost:5000';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewProject, setViewProject] = useState(null);
  const [viewCert, setViewCert] = useState(null);

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, projRes, certRes] = await Promise.all([
        userAPI.getProfile(username),
        projectAPI.getByUser(username),
        certificateAPI.getByUser(username)
      ]);
      setProfile(pRes.data);
      setProjects(projRes.data);
      setCertificates(certRes.data);
    } catch {
      toast.error('Profile not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectAPI.delete(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await certificateAPI.delete(id);
      setCertificates(prev => prev.filter(c => c._id !== id));
      toast.success('Certificate deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚡</div>
        <p style={{ color: 'var(--gray-500)' }}>Loading profile...</p>
      </div>
    </div>
  );

  if (!profile) return null;

  const initials = profile.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="animate-fade-in">
      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div className="profile-avatar-large">
              {profile.profilePicture
                ? <img src={`${API_BASE}${profile.profilePicture}`} alt="" />
                : initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 className="profile-name">{profile.fullName}</h1>
                {profile.isCollegeVerified && (
                  <span className="badge badge-verified" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                    ✓ Verified College
                  </span>
                )}
              </div>
              <p className="profile-username">@{profile.username}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>🎓 {profile.degree} in {profile.stream}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>🏫 {profile.collegeName}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>📅 Passing {profile.passingYear}</span>
              </div>
              {profile.bio && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: 10, maxWidth: 600 }}>{profile.bio}</p>}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {profile.resumeLink && (
                <a href={profile.resumeLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                  📄 Resume
                </a>
              )}
              {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: 40, height: 40 }}>GH</a>}
              {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: 40, height: 40 }}>in</a>}
              {isOwner && (
                <button className="btn btn-outline" onClick={() => setShowEditModal(true)} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, position: 'relative', zIndex: 1 }}>
              {profile.skills.map(s => (
                <span key={s} style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>{projects.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>Projects</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>{certificates.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>Certificates</div>
            </div>
            {profile.skills?.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>{profile.skills.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>Skills</div>
              </div>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {isOwner && activeTab === 'projects' && (
                <button className="btn btn-accent btn-sm" onClick={() => { setEditItem(null); setShowProjectModal(true); }}>
                  + Add Project
                </button>
              )}
              {isOwner && activeTab === 'certificates' && (
                <button className="btn btn-accent btn-sm" onClick={() => { setEditItem(null); setShowCertModal(true); }}>
                  + Add Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0 }}>
            {['projects', 'certificates'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '16px 28px', border: 'none', background: 'none',
                fontFamily: 'var(--font-body)', fontWeight: activeTab === tab ? 700 : 500,
                fontSize: '0.92rem', cursor: 'pointer',
                color: activeTab === tab ? 'var(--accent)' : 'var(--gray-500)',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s ease', textTransform: 'capitalize'
              }}>
                {tab === 'projects' ? '💼 ' : '🏆 '}{tab} ({tab === 'projects' ? projects.length : certificates.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '40px 24px', minHeight: '50vh' }}>
        {activeTab === 'projects' && (
          projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💼</div>
              <div className="empty-title">No projects yet</div>
              <p className="empty-text">{isOwner ? 'Add your first project to showcase your work!' : 'This user hasn\'t added any projects yet.'}</p>
              {isOwner && <button className="btn btn-accent" style={{ marginTop: 20 }} onClick={() => setShowProjectModal(true)}>+ Add First Project</button>}
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <ProjectCard
                  key={project._id} project={project}
                  isOwner={isOwner}
                  onEdit={() => { setEditItem(project); setShowProjectModal(true); }}
                  onDelete={() => handleDeleteProject(project._id)}
                  onView={() => setViewProject(project)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'certificates' && (
          certificates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <div className="empty-title">No certificates yet</div>
              <p className="empty-text">{isOwner ? 'Upload your certifications to showcase your achievements!' : 'No certificates posted yet.'}</p>
              {isOwner && <button className="btn btn-accent" style={{ marginTop: 20 }} onClick={() => setShowCertModal(true)}>+ Add Certificate</button>}
            </div>
          ) : (
            <div className="certs-grid">
              {certificates.map(cert => (
                <CertCard
                  key={cert._id} cert={cert}
                  isOwner={isOwner}
                  onEdit={() => { setEditItem(cert); setShowCertModal(true); }}
                  onDelete={() => handleDeleteCert(cert._id)}
                  onView={() => setViewCert(cert)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal
          editData={editItem}
          onClose={() => { setShowProjectModal(false); setEditItem(null); }}
          onSave={(data) => {
            if (editItem) setProjects(prev => prev.map(p => p._id === data._id ? data : p));
            else setProjects(prev => [data, ...prev]);
            setShowProjectModal(false); setEditItem(null);
          }}
        />
      )}
      {showCertModal && (
        <CertificateModal
          editData={editItem}
          onClose={() => { setShowCertModal(false); setEditItem(null); }}
          onSave={(data) => {
            if (editItem) setCertificates(prev => prev.map(c => c._id === data._id ? data : c));
            else setCertificates(prev => [data, ...prev]);
            setShowCertModal(false); setEditItem(null);
          }}
        />
      )}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={(data) => { setProfile(data); setShowEditModal(false); }}
        />
      )}
      {viewProject && <ProjectViewModal project={viewProject} onClose={() => setViewProject(null)} isOwner={isOwner} />}
      {viewCert && <CertViewModal cert={viewCert} onClose={() => setViewCert(null)} />}
    </div>
  );
}

// ---- PROJECT CARD ----
function ProjectCard({ project, isOwner, onEdit, onDelete, onView }) {
  return (
    <div className="project-card">
      <div className="project-thumb" onClick={onView} style={{ cursor: 'pointer' }}>
        {project.thumbnail
          ? <img src={`${API_BASE}${project.thumbnail}`} alt={project.title} />
          : <div style={{ fontSize: '3rem', opacity: 0.2 }}>💼</div>
        }
        {project.videoUrl && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>▶</div>
          </div>
        )}
      </div>
      <div className="project-body">
        <h3 className="project-title" onClick={onView} style={{ cursor: 'pointer' }}>{project.title}</h3>
        <p className="project-desc">{project.description?.substring(0, 120)}{project.description?.length > 120 ? '...' : ''}</p>
        {project.technologies?.length > 0 && (
          <div className="tech-tags">
            {project.technologies.slice(0, 4).map(t => <span key={t} className="tech-tag">{t}</span>)}
            {project.technologies.length > 4 && <span className="tech-tag">+{project.technologies.length - 4}</span>}
          </div>
        )}
        <div className="project-actions">
          <div className="project-links">
            {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="icon-btn" title="GitHub" onClick={e => e.stopPropagation()}>⌥</a>}
            {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="icon-btn" title="Live Demo" onClick={e => e.stopPropagation()}>🌐</a>}
            <button className="icon-btn" onClick={onView} title="View">👁</button>
          </div>
          {isOwner && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="icon-btn" onClick={onEdit} title="Edit">✏️</button>
              <button className="icon-btn" onClick={onDelete} title="Delete" style={{ color: 'var(--error)' }}>🗑</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- CERT CARD ----
function CertCard({ cert, isOwner, onEdit, onDelete, onView }) {
  return (
    <div className="cert-card" style={{ cursor: 'pointer' }} onClick={onView}>
      <div className="cert-icon">🏅</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div className="cert-title">{cert.title}</div>
            <div className="cert-issuer">{cert.issuedBy}</div>
            {cert.description && <div className="cert-desc">{cert.description.substring(0, 100)}{cert.description.length > 100 ? '...' : ''}</div>}
            <div className="cert-date">
              {cert.issueDate && `Issued: ${new Date(cert.issueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`}
              {cert.credentialId && ` · ID: ${cert.credentialId}`}
            </div>
            {cert.skills?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {cert.skills.map(s => <span key={s} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{s}</span>)}
              </div>
            )}
          </div>
          {isOwner && (
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <button className="icon-btn btn-sm" onClick={onEdit}>✏️</button>
              <button className="icon-btn btn-sm" onClick={onDelete} style={{ color: 'var(--error)' }}>🗑</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- PROJECT VIEW MODAL ----
function ProjectViewModal({ project, onClose, isOwner }) {
  const getYTEmbed = (url) => {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{project.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {project.videoUrl && (
            <div className="video-wrapper" style={{ marginBottom: 20 }}>
              <iframe src={getYTEmbed(project.videoUrl)} allowFullScreen title="Project Video" />
            </div>
          )}
          {project.thumbnail && !project.videoUrl && (
            <img src={`${API_BASE}${project.thumbnail}`} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 20, maxHeight: 300, objectFit: 'cover' }} />
          )}
          <p style={{ marginBottom: 16, lineHeight: 1.7 }}>{project.description}</p>
          {project.technologies?.length > 0 && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--gray-500)', marginBottom: 8 }}>Technologies</p>
              <div className="tech-tags" style={{ marginBottom: 20 }}>
                {project.technologies.map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">⌥ View on GitHub</a>}
            {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">🌐 Live Demo</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- CERT VIEW MODAL ----
function CertViewModal({ cert, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏅 {cert.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {cert.certificateFile && (
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              {cert.certificateFile.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                ? <img src={`${API_BASE}${cert.certificateFile}`} alt="Certificate" style={{ maxWidth: '100%', borderRadius: 12, boxShadow: 'var(--shadow-md)' }} />
                : <a href={`${API_BASE}${cert.certificateFile}`} target="_blank" rel="noreferrer" className="btn btn-outline">📄 View Certificate File</a>
              }
            </div>
          )}
          <div style={{ background: 'var(--off-white)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}><strong>Issued by:</strong> <span style={{ color: 'var(--accent)' }}>{cert.issuedBy}</span></div>
            {cert.issueDate && <div style={{ marginBottom: 8 }}><strong>Issue Date:</strong> {new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
            {cert.expiryDate && <div style={{ marginBottom: 8 }}><strong>Expiry:</strong> {new Date(cert.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
            {cert.credentialId && <div style={{ marginBottom: 8 }}><strong>Credential ID:</strong> <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{cert.credentialId}</span></div>}
          </div>
          {cert.description && <p style={{ lineHeight: 1.7, marginBottom: 16 }}>{cert.description}</p>}
          {cert.skills?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {cert.skills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
            </div>
          )}
          {cert.credentialUrl && (
            <div style={{ marginTop: 20 }}>
              <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">🔗 Verify Credential</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
