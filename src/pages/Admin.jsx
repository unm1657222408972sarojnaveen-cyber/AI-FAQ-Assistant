import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [s, u] = await Promise.all([api('/admin/stats'), api('/admin/users')]);
      setStats(s.stats); setUsers(u.users);
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    setError('');
    try { await api(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }); load(); }
    catch (err) { setError(err.message); }
  };

  const cards = stats ? [
    ['Users', stats.users], ['FAQs', stats.faqs], ['AI-generated FAQs', stats.aiFaqs],
    ['Categories', stats.categories], ['Searches', stats.searches], ['AI responses', stats.aiResponses],
  ] : [];

  return (
    <div>
      <h2>Admin dashboard</h2>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {cards.map(([label, value]) => (
          <div className="card stat" key={label}><div className="num">{value}</div><div className="muted">{label}</div></div>
        ))}
      </div>

      {stats && (
        <div className="card">
          <h3>Top viewed FAQs</h3>
          {stats.topFaqs.length === 0 && <p className="muted">No data yet.</p>}
          {stats.topFaqs.map((f) => <p key={f._id}>{f.question} <span className="muted">— {f.views} views</span></p>)}
        </div>
      )}

      <h3>Users</h3>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="faq_manager">faq_manager</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
