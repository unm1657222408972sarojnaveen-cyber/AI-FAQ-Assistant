import { useEffect, useState } from 'react';
import { api } from '../api';

const empty = { question: '', answer: '', category: '', keywords: '' };

export default function Manage() {
  const [faqs, setFaqs] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [newCat, setNewCat] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const [f, c] = await Promise.all([api('/faqs?limit=50'), api('/categories')]);
      setFaqs(f.faqs); setCats(c.categories);
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    const body = {
      question: form.question,
      answer: form.answer,
      category: form.category || undefined,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    };
    try {
      if (editId) await api(`/faqs/${editId}`, { method: 'PUT', body });
      else await api('/faqs', { method: 'POST', body });
      setMsg(editId ? 'FAQ updated' : 'FAQ created');
      setForm(empty); setEditId(null); load();
    } catch (err) { setError(err.message); }
  };

  const edit = (f) => {
    setEditId(f._id);
    setForm({ question: f.question, answer: f.answer, category: f.category?._id || '', keywords: (f.keywords || []).join(', ') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try { await api(`/faqs/${id}`, { method: 'DELETE' }); load(); } catch (err) { setError(err.message); }
  };

  const addCat = async (e) => {
    e.preventDefault();
    try { await api('/categories', { method: 'POST', body: { name: newCat } }); setNewCat(''); load(); }
    catch (err) { setError(err.message); }
  };

  const delCat = async (id) => {
    try { await api(`/categories/${id}`, { method: 'DELETE' }); load(); } catch (err) { setError(err.message); }
  };

  return (
    <div>
      <h2>Manage FAQs</h2>
      {error && <p className="error">{error}</p>}
      {msg && <p className="success">{msg}</p>}

      <form className="card" onSubmit={save}>
        <h3>{editId ? 'Edit FAQ' : 'Add FAQ'}</h3>
        <input name="question" placeholder="Question" value={form.question} onChange={change} required />
        <textarea name="answer" placeholder="Answer" rows={4} value={form.answer} onChange={change} required />
        <select name="category" value={form.category} onChange={change}>
          <option value="">No category</option>
          {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input name="keywords" placeholder="Keywords (comma separated)" value={form.keywords} onChange={change} />
        <div className="row">
          <button className="btn">{editId ? 'Update' : 'Create'}</button>
          {editId && <button type="button" className="btn small" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <div className="card">
        <h3>Categories</h3>
        <form className="row" onSubmit={addCat}>
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category name" required />
          <button className="btn small">Add</button>
        </form>
        <div className="chips">
          {cats.map((c) => (
            <span className="chip" key={c._id}>{c.name} <button onClick={() => delCat(c._id)} title="Delete">×</button></span>
          ))}
        </div>
      </div>

      <h3>All FAQs ({faqs.length})</h3>
      {faqs.map((f) => (
        <div className="card" key={f._id}>
          <strong>{f.question}</strong>
          <span className={`badge ${f.source === 'ai' ? 'ai' : 'faq'}`}>{f.source === 'ai' ? 'AI' : 'Manual'}</span>
          <p className="answer">{f.answer}</p>
          <small className="muted">{f.category?.name || 'No category'}</small>{' '}
          <button className="btn small" onClick={() => edit(f)}>Edit</button>{' '}
          <button className="btn small danger" onClick={() => remove(f._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
