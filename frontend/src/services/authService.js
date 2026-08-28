import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_USERS } from '../mocks/users';

export const authService = {
  async login(email, password) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        localStorage.setItem('mplads_auth_token', user.token);
        localStorage.setItem('mplads_user', JSON.stringify(user));
        return { user, token: user.token };
      }
      throw new Error('Invalid email or password credentials');
    }
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async getCurrentUser() {
    if (environment.enableMockApi) {
      // Always clear session on app start to enforce login page
      localStorage.removeItem('mplads_auth_token');
      localStorage.removeItem('mplads_user');
      return null;
    }
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async logout() {
    if (environment.enableMockApi) {
      localStorage.removeItem('mplads_auth_token');
      localStorage.removeItem('mplads_user');
      return true;
    }
    await apiClient.post('/auth/logout');
    localStorage.removeItem('mplads_auth_token');
    localStorage.removeItem('mplads_user');
    return true;
  },
};
