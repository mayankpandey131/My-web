import { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import './Portfolio.css';

const STATUS_COLOR = { Completed: 'chip-green', 'In Progress': 'chip-amber', 'On Hold': 'chip-gray' };

function getYTEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&?/\s]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

function getYTThumb(url) {
  const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&?/\s]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
}

export default function Portfolio() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('projects');
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get('/profile'),
      API.get('/projects'),
      API.get('/certificates'),
      API.get('/videos'),
    ]).then(([p, pr, c, v]) => {
      setData({
        user: p.data.user,
        projects: pr.data,
        certificates: c.data,
        videos: v.data,
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <div className="spin" />
    </div>
  );

  if (!data?.user) return (
    <div className="pf-empty-state">
      <div style={{ fontSize:56, marginBottom:16 }}>🚧</div>
      <h2>Portfolio coming soon</h2>
      <p>This portfolio is being set up. Check back soon!</p>
    </div>
  );

  const { user, projects, certificates, videos } = data;

  const tabs = [
    { id:'projects',     label:'Projects',     count: projects.length },
    { id:'certificates', label:'Certificates', count: certificates.length },
    { id:'videos',       label:'Videos',       count: videos.length },
  ];

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month:'short', year:'numeric' }) : '';

  return (
    <div className="pf-page page">
      <div className="wrap">

        {/* ── HERO ── */}
        <div className="pf-hero au">
          <div className="pf-avatar">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <span>{user.name?.charAt(0)?.toUpperCase()}</span>
            }
            <span className="pf-av-ring" />
          </div>

          <div className="pf-info">
            <h1 className="pf-name">{user.name}</h1>
            {user.headline && <p className="pf-headline">{user.headline}</p>}
            {user.location && <p className="pf-location">📍 {user.location}</p>}
            {user.bio && <p className="pf-bio">{user.bio}</p>}

            <div className="pf-links">
              {user.github   && <a href={user.github}   target="_blank" rel="noreferrer" className="pf-link">GitHub</a>}
              {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="pf-link">LinkedIn</a>}
              {user.website  && <a href={user.website}  target="_blank" rel="noreferrer" className="pf-link">Website</a>}
              {user.twitter  && <a href={user.twitter}  target="_blank" rel="noreferrer" className="pf-link">Twitter</a>}
            </div>

            {user.skills?.length > 0 && (
              <div className="chips" style={{ marginTop: 14 }}>
                {user.skills.map(s => <span key={s} className="chip chip-purple">{s}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="pf-stats au" style={{ animationDelay:'.1s' }}>
          {tabs.map(t => (
            <div key={t.id} className="pf-stat">
              <span className="pf-stat-n">{t.count}</span>
              <span className="pf-stat-l">{t.label}</span>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="pf-tabs au" style={{ animationDelay:'.15s' }}>
          {tabs.map(t => (
            <button key={t.id} className={`pf-tab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>
              {t.label}
              <span className="pf-tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        {/* ── PROJECTS ── */}
        {tab === 'projects' && (
          projects.length === 0
            ? <div className="empty"><div className="empty-icon">💻</div><h3>No projects yet</h3><p>Projects will appear here once added.</p></div>
            : <div className="grid3">
                {projects.map((p,i) => (
                  <div key={p._id} className="card pf-proj-card au" style={{ animationDelay:`${i*.06}s` }}>
                    <div className="pf-proj-thumb">
                      {p.thumbnail
                        ? <img src={p.thumbnail} alt={p.title} />
                        : <div className="pf-proj-thumb-empty">💻</div>
                      }
                      {p.featured && <span className="pf-featured">★ Featured</span>}
                      <span className={`chip ${STATUS_COLOR[p.status]} pf-status`}>{p.status}</span>
                    </div>
                    <div className="pf-proj-body">
                      <h3 className="pf-proj-title">{p.title}</h3>
                      <p className="pf-proj-desc">{p.description}</p>
                      {p.technologies?.length > 0 && (
                        <div className="chips" style={{ marginBottom:10 }}>
                          {p.technologies.slice(0,4).map(t => <span key={t} className="chip chip-gray">{t}</span>)}
                          {p.technologies.length > 4 && <span className="chip chip-gray">+{p.technologies.length-4}</span>}
                        </div>
                      )}
                      <div className="pf-proj-links">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="pf-ext-link">GitHub →</a>}
                        {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noreferrer" className="pf-ext-link live">Live Demo →</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab === 'certificates' && (
          certificates.length === 0
            ? <div className="empty"><div className="empty-icon">🏆</div><h3>No certificates yet</h3></div>
            : <div className="grid2">
                {certificates.map((c,i) => (
                  <div key={c._id} className="card pf-cert au" style={{ animationDelay:`${i*.06}s` }}>
                    <div className="pf-cert-icon">
                      {c.image ? <img src={c.image} alt="cert" /> : '🏆'}
                    </div>
                    <div className="pf-cert-info">
                      <h3 className="pf-cert-title">{c.title}</h3>
                      <p className="pf-cert-issuer">{c.issuer}</p>
                      <p className="pf-cert-date">Issued {fmtDate(c.issueDate)}{c.expiryDate ? ` · Expires ${fmtDate(c.expiryDate)}` : ''}</p>
                      {c.skills?.length > 0 && (
                        <div className="chips" style={{ margin:'8px 0' }}>
                          {c.skills.map(s => <span key={s} className="chip chip-purple">{s}</span>)}
                        </div>
                      )}
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="pf-ext-link" style={{ marginTop:6 }}>Verify Certificate →</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
        )}

        {/* ── VIDEOS ── */}
        {tab === 'videos' && (
          videos.length === 0
            ? <div className="empty"><div className="empty-icon">🎬</div><h3>No videos yet</h3></div>
            : <div className="grid3">
                {videos.map((v,i) => {
                  const embedUrl = getYTEmbed(v.videoUrl);
                  const autoThumb = getYTThumb(v.videoUrl);
                  const thumb = v.thumbnail || autoThumb;
                  return (
                    <div key={v._id} className="card pf-vid au" style={{ animationDelay:`${i*.06}s` }}>
                      <div className="pf-vid-thumb" onClick={() => setPlaying(playing===v._id ? null : v._id)}>
                        {playing === v._id && embedUrl
                          ? <iframe src={`${embedUrl}?autoplay=1`} title={v.title} allow="autoplay; fullscreen" allowFullScreen />
                          : <>
                              {thumb ? <img src={thumb} alt={v.title} /> : <div className="pf-vid-empty">🎬</div>}
                              <div className="pf-play"><div className="pf-play-btn">▶</div></div>
                            </>
                        }
                      </div>
                      <div className="pf-vid-body">
                        <h3 className="pf-vid-title">{v.title}</h3>
                        {v.description && <p className="pf-vid-desc">{v.description}</p>}
                        <div className="pf-vid-meta">
                          {v.duration && <span>⏱ {v.duration}</span>}
                          <span>👁 {v.views}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
        )}

      </div>
    </div>
  );
}
