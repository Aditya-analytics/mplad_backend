import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { environment } from '../config/environment';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // In mock mode: always start logged OUT. Clear any stale session immediately.
  const [user, setUser] = useState(() => {
    if (environment.enableMockApi) {
      localStorage.removeItem('mplads_auth_token');
      localStorage.removeItem('mplads_user');
      return null;
    }
    // Real API mode: try restoring from localStorage synchronously
    try {
      const stored = localStorage.getItem('mplads_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || 'GUEST',
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
