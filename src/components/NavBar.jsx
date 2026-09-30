import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isManager = user && ['faq_manager', 'admin'].includes(user.role);

  return (
    <nav className="nav">
      <span className="brand">AI FAQ Assistant</span>
      {user ? (
        <>
          <NavLink to="/" end>Ask</NavLink>
          <NavLink to="/faqs">FAQs</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
          {isManager && <NavLink to="/manage">Manage FAQs</NavLink>}
          {user.role === 'admin' && <NavLink to="/admin">Dashboard</NavLink>}
          <span className="spacer" />
          <span className="who">{user.name} ({user.role})</span>
          <button className="btn small" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </>
      ) : (
        <>
          <span className="spacer" />
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}
