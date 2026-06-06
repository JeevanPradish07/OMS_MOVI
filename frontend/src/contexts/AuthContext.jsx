import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';   // ← use configured instance (baseURL + interceptors)

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem('owms_token'));
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    // MOCK LOGIN - Role determined by credentials
    const t = 'mock-jwt-token-123';
    let role = 'viewer'; // default
    if (email.startsWith('admin')) role = 'admin';
    else if (email.startsWith('hr')) role = 'hr';
    else if (email.startsWith('pmo')) role = 'pmo';
    else if (email.startsWith('intern')) role = 'intern';
    else if (email.startsWith('dept')) role = 'dept';

    const u = {
      _id: 'mock-user-123',
      name: email.split('@')[0].toUpperCase(),
      email,
      role
    };
    localStorage.setItem('owms_token', t);
    localStorage.setItem('owms_mock_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('owms_token');
    localStorage.removeItem('owms_mock_user');
    setToken(null);
    setUser(null);
  }, []);

  // Restore session on mount / token change
  useEffect(() => {
    const restore = async () => {
      if (!token) { setLoading(false); return; }
      try {
        // MOCK RESTORE
        const u = JSON.parse(localStorage.getItem('owms_mock_user'));
        if (u) {
          setUser(u);
        } else {
          logout();
        }
      } catch {
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
