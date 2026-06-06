import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';   // ← use configured instance (baseURL + interceptors)

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem('owms_token'));
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('owms_token', t);
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('owms_token');
    setToken(null);
    setUser(null);
  }, []);

  // Restore session on mount / token change
  useEffect(() => {
    const restore = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.user);
      } catch {
        // Token invalid / expired — api interceptor already redirects on 401,
        // but we clean up state here too
        logout();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
