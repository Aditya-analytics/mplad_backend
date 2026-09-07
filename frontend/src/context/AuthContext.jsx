import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { environment } from '../config/environment';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
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

  const signup = async (citizenData) => {
    setLoading(true);
    try {
      const data = await authService.signup(citizenData);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateVerification = (isVerified = true, meta = {}) => {
    if (!user) return;
    const updated = {
      ...user,
      isVerified,
      verificationDate: new Date().toISOString().split('T')[0],
      ...meta,
    };
    setUser(updated);
    localStorage.setItem('mplads_user', JSON.stringify(updated));

    // Update in citizen_accounts as well if stored
    try {
      const accounts = JSON.parse(localStorage.getItem('citizen_accounts') || '[]');
      const idx = accounts.findIndex((a) => a.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        accounts[idx] = { ...accounts[idx], ...updated };
        localStorage.setItem('citizen_accounts', JSON.stringify(accounts));
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || 'GUEST',
        isVerified: Boolean(user?.isVerified),
        loading,
        login,
        signup,
        logout,
        updateVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

