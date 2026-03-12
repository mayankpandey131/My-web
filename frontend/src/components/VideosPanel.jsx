import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Panel.css';

const BLANK = { title:'', description:'', videoUrl:'', thumbnail:'', duration:'', tags:[] };

export default function VideosPanel({ onCountChange }) {
  const { API } = useAuth();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [tagIn,    setTagIn]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try { const r = await API.get('/videos'); setItems(r.data); onCountChange(r.data.length); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(BLANK); setEditId(null); setTagIn(''); setModal(true); };
  const openEdit = (v) => { setForm({...v,tags:[...(v.tags||[])]}); setEditId(v._id); setTagIn(''); setModal(true); };
  const close    = () => { setModal(false); setEditId(null); };

  const addTag = (e) => {
    if ((e.key==='Enter'||e.key===',') && tagIn.trim()) {
      e.preventDefault();
      const t = tagIn.trim().replace(/,$/,'');
      if (t && !form.tags.includes(t)) setForm(f=>({...f,tags:[...f.tags,t]}));
      setTagIn('');
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()||!form.videoUrl.trim()) return toast.error('Title and video URL required');
    setSaving(true);
    try {
      if (editId) {
        const r = await API.put(`/videos/${editId}`, form);
        setItems(items.map(i=>i._id===editId?r.data:i));
        toast.success('Updated ✅');
      } else {
        const r = await API.post('/videos', form);
        const next = [r.data,...items]; setItems(next); onCountChange(next.length);
        toast.success('Video added 🎬');
      }
      close();
    } catch(err) { toast.error(err.response?.data?.error||'Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    setDeleting(id);
    try {
      await API.delete(`/videos/${id}`);
      const next = items.filter(i=>i._id!==id); setItems(next); onCountChange(next.length);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const ytThumb = (url) => {
    const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^&?/\s]+)/);
    return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
  };

  if (loading) return <div className="panel-loading"><div className="spin"/></div>;

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Videos</h2>
          <p className="panel-sub">{items.length} video{items.length!==1?'s':''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Video</button>
      </div>

      {items.length === 0
        ? <div className="empty"><div className="empty-icon">🎬</div><h3>No videos yet</h3><p>Add YouTube or Vimeo demo videos.</p><button className="btn btn-primary mt4" onClick={openAdd}>+ Add Video</button></div>
        : <div className="panel-list">
            {items.map((v,i)=>(
              <div key={v._id} className="panel-row au" style={{animationDelay:`${i*.04}s`}}>
                <div className="panel-row-thumb vid-thumb">
                  {(v.thumbnail||ytThumb(v.videoUrl))
                    ? <img src={v.thumbnail||ytThumb(v.videoUrl)} alt={v.title}/>
                    : <span>🎬</span>
                  }
                </div>
                <div className="panel-row-info">
                  <div className="panel-row-title">{v.title}</div>
                  <div className="panel-row-sub">{v.description?.slice(0,70)}{v.description?.length>70?'...':''}</div>
                  <div className="panel-row-sub">👁 {v.views} views {v.duration&&`· ⏱ ${v.duration}`}</div>
                </div>
                <div className="panel-row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(v)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(v._id)} disabled={deleting===v._id}>
                    {deleting===v._id?<span className="spin-sm"/>:'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
      }

      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="modal">
            <div className="mhead"><h2>{editId?'Edit Video':'Add Video'}</h2><button className="mclose" onClick={close}>×</button></div>
            <form onSubmit={save} className="mform">
              <div className="fgroup">
                <label className="flabel">Title *</label>
                <input className="finput" placeholder="Project Demo" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/>
              </div>
              <div className="fgroup">
                <label className="flabel">Video URL * (YouTube / Vimeo)</label>
                <input className="finput" placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e=>setForm(f=>({...f,videoUrl:e.target.value}))} required/>
              </div>
              <div className="fgroup">
                <label className="flabel">Description</label>
                <textarea className="ftextarea" placeholder="What does this video cover?" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
              </div>
              <div className="fgrid2">
                <div className="fgroup">
                  <label className="flabel">Custom Thumbnail URL</label>
                  <input className="finput" placeholder="https://... (auto for YouTube)" value={form.thumbnail} onChange={e=>setForm(f=>({...f,thumbnail:e.target.value}))}/>
                </div>
                <div className="fgroup">
                  <label className="flabel">Duration (e.g. 5:30)</label>
                  <input className="finput" placeholder="5:30" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/>
                </div>
              </div>
              <div className="fgroup">
                <label className="flabel">Tags (Enter or comma)</label>
                <input className="finput" placeholder="React, Demo, Tutorial..." value={tagIn} onChange={e=>setTagIn(e.target.value)} onKeyDown={addTag}/>
                {form.tags.length>0 && (
                  <div className="chips" style={{marginTop:8}}>
                    {form.tags.map(t=>(
                      <span key={t} className="tag-pill">{t}
                        <button type="button" className="tag-x" onClick={()=>setForm(f=>({...f,tags:f.tags.filter(x=>x!==t)}))}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mfoot">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving?<><span className="spin-sm"/> Saving...</>:editId?'Update':'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
