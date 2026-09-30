import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = () => api('/notifications?limit=50').then((d) => setItems(d.notifications)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => { await api(`/notifications/${id}/read`, { method: 'PATCH' }); load(); };

  return (
    <div>
      <h2>Notifications</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && !error && <p className="muted">No notifications.</p>}
      {items.map((n) => (
        <div className={`card ${n.isRead ? 'read' : ''}`} key={n._id}>
          <strong>{n.title}</strong>
          <p>{n.message}</p>
          <small className="muted">{new Date(n.createdAt).toLocaleString()}</small>{' '}
          {!n.isRead && <button className="btn small" onClick={() => markRead(n._id)}>Mark as read</button>}
        </div>
      ))}
    </div>
  );
}
