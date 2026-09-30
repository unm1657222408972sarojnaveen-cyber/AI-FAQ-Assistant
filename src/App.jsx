import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import NavBar from './components/NavBar.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Ask from './pages/Ask.jsx';
import Faqs from './pages/Faqs.jsx';
import History from './pages/History.jsx';
import Notifications from './pages/Notifications.jsx';
import Manage from './pages/Manage.jsx';
import Admin from './pages/Admin.jsx';

// Only logged-in users (and optionally specific roles) can open a page
function Guard({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/" element={<Guard><Ask /></Guard>} />
          <Route path="/faqs" element={<Guard><Faqs /></Guard>} />
          <Route path="/history" element={<Guard><History /></Guard>} />
          <Route path="/notifications" element={<Guard><Notifications /></Guard>} />
          <Route path="/manage" element={<Guard roles={['faq_manager', 'admin']}><Manage /></Guard>} />
          <Route path="/admin" element={<Guard roles={['admin']}><Admin /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
