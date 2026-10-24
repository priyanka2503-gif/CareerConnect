import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('careerconnect_token', response.data.token);
      localStorage.setItem('careerconnect_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('careerconnect_token', response.data.token);
      localStorage.setItem('careerconnect_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('careerconnect_token');
    localStorage.removeItem('careerconnect_user');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('careerconnect_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getStoredToken: () => {
    return localStorage.getItem('careerconnect_token');
  },

  setStoredUser: (userData) => {
    localStorage.setItem('careerconnect_user', JSON.stringify(userData));
  }
};

export default authService;
