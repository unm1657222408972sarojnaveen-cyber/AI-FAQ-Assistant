import { useEffect, useState } from 'react';
import { api } from '../api';

export default function History() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/search-history?limit=50').then((d) => setItems(d.history)).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h2>Search history</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error && <p className="muted">No searches yet.</p>}
      {items.map((h) => (
        <div className="card" key={h._id}>
          <strong>{h.query}</strong>
          <span className={`badge ${h.source}`}>{h.source}</span>
          <br /><small className="muted">{new Date(h.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
