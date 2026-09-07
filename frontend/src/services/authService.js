import apiClient from './apiClient';
import { environment } from '../config/environment';
import { MOCK_USERS } from '../mocks/users';

export const authService = {
  async login(email, password) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const cleanEmail = (email || '').trim().toLowerCase();

      // Check predefined mock users (Admin H. Pandey, Officer R. Sharma, Demo Citizens)
      let user = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

      // Also check dynamically registered citizens from localStorage
      if (!user) {
        try {
          const registered = JSON.parse(localStorage.getItem('citizen_accounts') || '[]');
          user = registered.find((u) => (u.email || '').toLowerCase() === cleanEmail);
        } catch {
          // ignore
        }
      }

      if (user) {
        const token = user.token || `mock-token-${user.id || 'cit'}`;
        const userWithToken = { ...user, token };
        localStorage.setItem('mplads_auth_token', token);
        localStorage.setItem('mplads_user', JSON.stringify(userWithToken));
        return { user: userWithToken, token };
      }
      throw new Error('Invalid email or password credentials');
    }
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async signup(citizenData) {
    if (environment.enableMockApi) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newUser = {
        id: `USR-CIT-${Date.now()}`,
        name: citizenData.fullName,
        fullName: citizenData.fullName,
        email: citizenData.email,
        mobile: citizenData.mobile,
        state: citizenData.state || 'Maharashtra',
        district: citizenData.district || 'Pune',
        role: 'CITIZEN',
        isVerified: false,
        memberSince: new Date().toISOString().split('T')[0],
        avatar: citizenData.fullName.substring(0, 2).toUpperCase(),
        token: `mock-token-cit-${Date.now()}`,
      };

      const registered = JSON.parse(localStorage.getItem('citizen_accounts') || '[]');
      registered.push(newUser);
      localStorage.setItem('citizen_accounts', JSON.stringify(registered));

      return { user: newUser, token: newUser.token };
    }
    const response = await apiClient.post('/auth/signup', citizenData);
    return response.data;
  },

  async getCurrentUser() {
    if (environment.enableMockApi) {
      try {
        const stored = localStorage.getItem('mplads_user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
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

