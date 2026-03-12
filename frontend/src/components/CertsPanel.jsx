import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Panel.css';

const BLANK = { title:'', issuer:'', issueDate:'', expiryDate:'', credentialId:'', credentialUrl:'', image:'', skills:[] };

export default function CertsPanel({ onCountChange }) {
  const { API } = useAuth();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [skillIn,  setSkillIn]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try { const r = await API.get('/certificates'); setItems(r.data); onCountChange(r.data.length); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(BLANK); setEditId(null); setSkillIn(''); setModal(true); };
  const openEdit = (c) => {
    setForm({...c, skills:[...(c.skills||[])], issueDate:c.issueDate?c.issueDate.split('T')[0]:'', expiryDate:c.expiryDate?c.expiryDate.split('T')[0]:''});
    setEditId(c._id); setSkillIn(''); setModal(true);
  };
  const close = () => { setModal(false); setEditId(null); };

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
                  <div className="panel-row-title">{c.title}</div>
                  <div className="panel-row-sub" style={{color:'var(--purple-light)'}}>{c.issuer}</div>
                  <div className="panel-row-sub">Issued {fmtDate(c.issueDate)}</div>
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
                <label className="flabel">Certificate Name *</label>
                <input className="finput" placeholder="AWS Solutions Architect" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/>
              </div>
              <div className="fgroup">
                <label className="flabel">Issuing Organization *</label>
                <input className="finput" placeholder="Amazon Web Services" value={form.issuer} onChange={e=>setForm(f=>({...f,issuer:e.target.value}))} required/>
              </div>
              <div className="fgrid2">
                <div className="fgroup">
                  <label className="flabel">Issue Date *</label>
                  <input type="date" className="finput" value={form.issueDate} onChange={e=>setForm(f=>({...f,issueDate:e.target.value}))} required/>
                </div>
                <div className="fgroup">
                  <label className="flabel">Expiry Date</label>
                  <input type="date" className="finput" value={form.expiryDate} onChange={e=>setForm(f=>({...f,expiryDate:e.target.value}))}/>
                </div>
              </div>
              <div className="fgrid2">
                <div className="fgroup">
                  <label className="flabel">Credential ID</label>
                  <input className="finput" placeholder="ABC-123" value={form.credentialId} onChange={e=>setForm(f=>({...f,credentialId:e.target.value}))}/>
                </div>
                <div className="fgroup">
                  <label className="flabel">Badge Image URL</label>
                  <input className="finput" placeholder="https://..." value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))}/>
                </div>
              </div>
              <div className="fgroup">
                <label className="flabel">Verify URL</label>
                <input className="finput" placeholder="https://credly.com/..." value={form.credentialUrl} onChange={e=>setForm(f=>({...f,credentialUrl:e.target.value}))}/>
              </div>
              <div className="fgroup">
                <label className="flabel">Skills (Enter or comma)</label>
                <input className="finput" placeholder="Cloud, AWS, Security..." value={skillIn} onChange={e=>setSkillIn(e.target.value)} onKeyDown={addSkill}/>
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
