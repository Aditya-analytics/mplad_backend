import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      role: 'GUEST',
      loading: false,
      login: async () => {
        throw new Error('Authentication is unavailable. Please refresh the page.');
      },
      logout: async () => {},
    };
  }
  return context;
}
