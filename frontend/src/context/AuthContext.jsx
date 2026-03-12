import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('pf_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export function AuthProvider({ children }) {
  const [user,       setUser]       = useState(null);
  const [registered, setRegistered] = useState(null); // null = still loading
  const [authReady,  setAuthReady]  = useState(false); // true when BOTH checks done

  useEffect(() => {
    const init = async () => {
      // Step 1: check if owner is registered
      let isRegistered = false;
      try {
        const r = await API.get('/auth/status');
        isRegistered = r.data.registered;
        setRegistered(isRegistered);
      } catch {
        setRegistered(false);
      }

      // Step 2: if token exists, verify it
      const token = localStorage.getItem('pf_token');
      if (token) {
        try {
          const r = await API.get('/auth/me');
          setUser(r.data.user);
        } catch {
          localStorage.removeItem('pf_token');
        }
      }

      // Both done — app can render
      setAuthReady(true);
    };

    init();
  }, []);

  const register = async (name, email, password) => {
    const r = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('pf_token', r.data.token);
    setUser(r.data.user);
    setRegistered(true);
  };

  const login = async (email, password) => {
    const r = await API.post('/auth/login', { email, password });
    localStorage.setItem('pf_token', r.data.token);
    setUser(r.data.user);
  };

  const logout = () => {
    localStorage.removeItem('pf_token');
    setUser(null);
  };

  const updateUser = (u) => setUser(u);

  return (
    <Ctx.Provider value={{ user, registered, authReady, register, login, logout, updateUser, API }}>
      {children}
    </Ctx.Provider>
  );
}
