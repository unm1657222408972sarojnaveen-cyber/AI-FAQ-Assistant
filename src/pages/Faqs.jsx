import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');

  const load = async (p = page, search = q) => {
    try {
      const d = await api(`/faqs?page=${p}&limit=8${search ? `&q=${encodeURIComponent(search)}` : ''}`);
      setFaqs(d.faqs); setPages(d.pages || 1); setError('');
    } catch (err) { setError(err.message); }
  };

  useEffect(() => { load(page); }, [page]);

  return (
    <div>
      <h2>FAQs</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); setPage(1); load(1, q); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search FAQs..." />
        <button className="btn">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      {faqs.length === 0 && !error && <p className="muted">No FAQs found.</p>}
      {faqs.map((f) => (
        <div className="card" key={f._id}>
          <strong>{f.question}</strong>
          <span className={`badge ${f.source === 'ai' ? 'ai' : 'faq'}`}>{f.source === 'ai' ? 'AI' : 'Manual'}</span>
          <p className="answer">{f.answer}</p>
          <small className="muted">{f.category?.name || 'No category'} • {f.views} views</small>
        </div>
      ))}
      <div className="row">
        <button className="btn small" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span className="muted">Page {page} of {pages}</span>
        <button className="btn small" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
