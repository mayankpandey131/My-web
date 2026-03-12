import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Panel.css';

const BLANK = { title:'', description:'', thumbnail:'', technologies:[], githubUrl:'', liveUrl:'', status:'Completed', featured:false };
const STATUS_CHIP = { Completed:'chip-green', 'In Progress':'chip-amber', 'On Hold':'chip-gray' };

export default function ProjectsPanel({ onCountChange }) {
  const { API } = useAuth();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [techIn,   setTechIn]   = useState('');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try { const r = await API.get('/projects'); setItems(r.data); onCountChange(r.data.length); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(BLANK); setEditId(null); setTechIn(''); setModal(true); };
  const openEdit = (p) => { setForm({...p, technologies:[...( p.technologies||[])] }); setEditId(p._id); setTechIn(''); setModal(true); };
  const close    = () => { setModal(false); setEditId(null); };

  const addTech = (e) => {
    if ((e.key==='Enter'||e.key===',') && techIn.trim()) {
      e.preventDefault();
      const t = techIn.trim().replace(/,$/,'');
      if (t && !form.technologies.includes(t)) setForm(f=>({...f, technologies:[...f.technologies,t]}));
      setTechIn('');
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description required');
    setSaving(true);
    try {
      if (editId) {
        const r = await API.put(`/projects/${editId}`, form);
        setItems(items.map(i => i._id===editId ? r.data : i));
        toast.success('Project updated ✅');
      } else {
        const r = await API.post('/projects', form);
        const next = [r.data, ...items];
        setItems(next); onCountChange(next.length);
        toast.success('Project added 🚀');
      }
      close();
    } catch(err) { toast.error(err.response?.data?.error||'Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setDeleting(id);
    try {
      await API.delete(`/projects/${id}`);
      const next = items.filter(i=>i._id!==id); setItems(next); onCountChange(next.length);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  if (loading) return <div className="panel-loading"><div className="spin"/></div>;

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Projects</h2>
          <p className="panel-sub">{items.length} project{items.length!==1?'s':''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Project</button>
      </div>

      {items.length === 0
        ? <div className="empty"><div className="empty-icon">💻</div><h3>No projects yet</h3><p>Add your first project to get started.</p><button className="btn btn-primary mt4" onClick={openAdd}>+ Add Project</button></div>
        : <div className="panel-list">
            {items.map((p,i) => (
              <div key={p._id} className="panel-row au" style={{animationDelay:`${i*.04}s`}}>
                <div className="panel-row-thumb">
                  {p.thumbnail ? <img src={p.thumbnail} alt={p.title}/> : <span>💻</span>}
                </div>
                <div className="panel-row-info">
                  <div className="panel-row-title">{p.title} {p.featured && <span className="pf-featured-sm">★</span>}</div>
                  <div className="panel-row-sub">{p.description?.slice(0,80)}...</div>
                  <div className="chips" style={{marginTop:5}}>
                    <span className={`chip ${STATUS_CHIP[p.status]}`}>{p.status}</span>
                    {p.technologies?.slice(0,3).map(t=><span key={t} className="chip chip-gray">{t}</span>)}
                    {p.technologies?.length>3 && <span className="chip chip-gray">+{p.technologies.length-3}</span>}
                  </div>
                </div>
                <div className="panel-row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(p._id)} disabled={deleting===p._id}>
                    {deleting===p._id?<span className="spin-sm"/>:'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
      }

      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="modal">
            <div className="mhead">
              <h2>{editId?'Edit Project':'New Project'}</h2>
              <button className="mclose" onClick={close}>×</button>
            </div>
            <form onSubmit={save} className="mform">
              <div className="fgroup">
                <label className="flabel">Title *</label>
                <input className="finput" placeholder="My Awesome Project" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/>
              </div>
              <div className="fgroup">
                <label className="flabel">Description *</label>
                <textarea className="ftextarea" placeholder="What does this project do?" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required/>
              </div>
              <div className="fgroup">
                <label className="flabel">Thumbnail URL</label>
                <input className="finput" placeholder="https://i.imgur.com/..." value={form.thumbnail} onChange={e=>setForm(f=>({...f,thumbnail:e.target.value}))}/>
              </div>
              <div className="fgroup">
                <label className="flabel">Technologies (Enter or comma to add)</label>
                <input className="finput" placeholder="React, Node.js, MongoDB..." value={techIn} onChange={e=>setTechIn(e.target.value)} onKeyDown={addTech}/>
                {form.technologies.length>0 && (
                  <div className="chips" style={{marginTop:8}}>
                    {form.technologies.map(t=>(
                      <span key={t} className="tag-pill">{t}
                        <button type="button" className="tag-x" onClick={()=>setForm(f=>({...f,technologies:f.technologies.filter(x=>x!==t)}))}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="fgrid2">
                <div className="fgroup">
                  <label className="flabel">GitHub URL</label>
                  <input className="finput" placeholder="https://github.com/..." value={form.githubUrl} onChange={e=>setForm(f=>({...f,githubUrl:e.target.value}))}/>
                </div>
                <div className="fgroup">
                  <label className="flabel">Live URL</label>
                  <input className="finput" placeholder="https://mysite.com" value={form.liveUrl} onChange={e=>setForm(f=>({...f,liveUrl:e.target.value}))}/>
                </div>
              </div>
              <div className="fgrid2">
                <div className="fgroup">
                  <label className="flabel">Status</label>
                  <select className="fselect" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                    <option>Completed</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                  </select>
                </div>
                <div className="fgroup">
                  <label className="flabel">Featured?</label>
                  <label className="toggle" style={{marginTop:8}}>
                    <input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}/>
                    <span className="toggle-track"/>
                    <span className="toggle-lbl">{form.featured?'Yes — shown first':'No'}</span>
                  </label>
                </div>
              </div>
              <div className="mfoot">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving?<><span className="spin-sm"/> Saving...</>:editId?'Update Project':'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
