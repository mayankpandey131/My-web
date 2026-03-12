import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProjectsPanel    from '../components/ProjectsPanel';
import CertsPanel       from '../components/CertsPanel';
import VideosPanel      from '../components/VideosPanel';
import './Admin.css';

export default function Admin() {
  const { user, API } = useAuth();
  const [tab, setTab] = useState('projects');
  const [counts, setCounts] = useState({ projects:0, certificates:0, videos:0 });

  useEffect(() => {
    Promise.all([
      API.get('/projects'),
      API.get('/certificates'),
      API.get('/videos'),
    ]).then(([p,c,v]) => setCounts({
      projects: p.data.length,
      certificates: c.data.length,
      videos: v.data.length,
    }));
  }, [API]);

  const tabs = [
    { id:'projects',     emoji:'💻', label:'Projects' },
    { id:'certificates', emoji:'🏆', label:'Certificates' },
    { id:'videos',       emoji:'🎬', label:'Videos' },
  ];

  return (
    <div className="page wrap">

      {/* HEADER */}
      <div className="admin-header au">
        <div>
          <p className="admin-welcome">Welcome back,</p>
          <h1 className="admin-name">{user?.name} 👋</h1>
        </div>
        <div className="admin-header-right">
          <Link to="/" className="btn btn-ghost btn-sm">View Portfolio ↗</Link>
          <Link to="/admin/profile" className="btn btn-outline btn-sm">Edit Profile</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="admin-stats au" style={{ animationDelay:'.08s' }}>
        {tabs.map(t => (
          <div key={t.id} className="admin-stat" onClick={() => setTab(t.id)} style={{ cursor:'pointer' }}>
            <span className="admin-stat-emoji">{t.emoji}</span>
            <div>
              <div className="admin-stat-n">{counts[t.id]}</div>
              <div className="admin-stat-l">{t.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="admin-tabs au" style={{ animationDelay:'.12s' }}>
        {tabs.map(t => (
          <button key={t.id} className={`admin-tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* PANELS */}
      <div className="au" style={{ animationDelay:'.16s' }}>
        {tab === 'projects'     && <ProjectsPanel onCountChange={n => setCounts(c=>({...c,projects:n}))} />}
        {tab === 'certificates' && <CertsPanel    onCountChange={n => setCounts(c=>({...c,certificates:n}))} />}
        {tab === 'videos'       && <VideosPanel   onCountChange={n => setCounts(c=>({...c,videos:n}))} />}
      </div>

    </div>
  );
}
