import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) { setLoading(false); return; }
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const d = await api(path, { method: 'POST', body });
    localStorage.setItem('token', d.token);
    setUser(d.user);
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return (
    <Ctx.Provider value={{
      user, loading, logout,
      login: (b) => authenticate('/auth/login', b),
      register: (b) => authenticate('/auth/register', b),
    }}>
      {children}
    </Ctx.Provider>
  );
}
