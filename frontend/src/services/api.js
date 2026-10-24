
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8083'}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerconnect_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
