import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Panel.css';

const BLANK = { image:'', description:'' };

export default function CertsPanel({ onCountChange }) {
  const { API } = useAuth();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try { const r = await API.get('/certificates'); setItems(r.data); onCountChange(r.data.length); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(BLANK); setEditId(null); setModal(true); };
  const openEdit = (c) => {
    setForm({ image:c.image || '', description: c.description || '' });
    setEditId(c._id); setModal(true);
  };
  const close = () => { setModal(false); setEditId(null); };

  const handleImageFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, image: reader.result }));
    reader.onerror = () => toast.error('Failed to read image file');
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const r = await API.put(`/certificates/${editId}`, form);
        setItems(items.map(i=>i._id===editId?r.data:i));
        toast.success('Updated ✅');
      } else {
        const r = await API.post('/certificates', form);
        const next = [r.data, ...items]; setItems(next); onCountChange(next.length);
        toast.success('Certificate added 🏆');
      }
      close();
    } catch(err) { toast.error(err.response?.data?.error||'Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    setDeleting(id);
    try {
      await API.delete(`/certificates/${id}`);
      const next = items.filter(i=>i._id!==id); setItems(next); onCountChange(next.length);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '';

  if (loading) return <div className="panel-loading"><div className="spin"/></div>;

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Certificates</h2>
          <p className="panel-sub">{items.length} certificate{items.length!==1?'s':''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Certificate</button>
      </div>

      {items.length === 0
        ? <div className="empty"><div className="empty-icon">🏆</div><h3>No certificates yet</h3><p>Add your credentials and achievements.</p><button className="btn btn-primary mt4" onClick={openAdd}>+ Add Certificate</button></div>
        : <div className="panel-list">
            {items.map((c,i)=>(
              <div key={c._id} className="panel-row au" style={{animationDelay:`${i*.04}s`}}>
                <div className="panel-row-thumb cert-thumb">
                  {c.image?<img src={c.image} alt="cert"/>:<span>🏆</span>}
                </div>
                <div className="panel-row-info">
                  <div className="panel-row-title">Certificate</div>
                  <div className="panel-row-sub" style={{color:'var(--purple-light)'}}>{c.description || 'No description provided'}</div>
                </div>
                <div className="panel-row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(c)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(c._id)} disabled={deleting===c._id}>
                    {deleting===c._id?<span className="spin-sm"/>:'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
      }

      {modal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="modal">
            <div className="mhead"><h2>{editId?'Edit Certificate':'Add Certificate'}</h2><button className="mclose" onClick={close}>×</button></div>
            <form onSubmit={save} className="mform">
              <div className="fgroup">
                <label className="flabel">Certificate Image (upload file)</label>
                <input type="file" className="finput" accept="image/*" onChange={e => handleImageFile(e.target.files?.[0])} />
                {form.image && (<img src={form.image} alt="certificate preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 140, borderRadius: 6 }} />)}
              </div>
              <div className="fgroup">
                <label className="flabel">Description</label>
                <textarea className="finput" style={{ minHeight: 100 }} placeholder="Summary of what this certificate is for" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="mfoot">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving?<><span className="spin-sm"/> Saving...</>:editId?'Update':'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
