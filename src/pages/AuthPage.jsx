import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (isLogin) await login({ email: form.email, password: form.password });
      else await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>{isLogin ? 'Login' : 'Create account'}</h2>
      {!isLogin && <input name="name" placeholder="Full name" value={form.name} onChange={change} required />}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={change} required />
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Login' : 'Register'}</button>
      <p className="muted">
        {isLogin ? <>No account? <Link to="/register">Register</Link></> : <>Already registered? <Link to="/login">Login</Link></>}
      </p>
    </form>
  );
}
