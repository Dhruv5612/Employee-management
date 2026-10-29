import axios from 'axios';
import { mockAdapter } from './mockAdapter.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const isDemoMode = () => {
  return localStorage.getItem('ems_use_demo_mode') === 'true';
};

export const setDemoMode = (val) => {
  if (val) {
    localStorage.setItem('ems_use_demo_mode', 'true');
  } else {
    localStorage.removeItem('ems_use_demo_mode');
  }
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3500, // Responsive fallback if backend server is not running
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach authorization token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthorized 401 or fallback
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear token if unauthorized on protected routes (not during login/signup attempt)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login') && !error.config?.url?.includes('/auth/signup')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { mockAdapter };
