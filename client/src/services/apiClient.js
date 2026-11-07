import axios from 'axios';
import { mockAdapter } from './mockAdapter.js';

const getApiBaseUrl = () => {
  // If running in browser on Vercel or any deployed domain (not localhost): ALWAYS use relative '/api/v1'
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api/v1';
  }
  // If production bundle, use relative '/api/v1'
  if (import.meta.env.PROD) {
    return '/api/v1';
  }
  // Local development fallback to port 5000
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export const isDemoMode = () => false;

export const setDemoMode = () => {
  localStorage.removeItem('ems_use_demo_mode');
};

// Ensure demo mode is cleared from browser storage
if (typeof window !== 'undefined') {
  localStorage.removeItem('ems_use_demo_mode');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20s timeout for live API and real SMTP email delivery
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach authorization token & strictly guard against localhost URLs on deployed environments
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (config.baseURL && (config.baseURL.includes('localhost') || config.baseURL.includes('127.0.0.1'))) {
      config.baseURL = '/api/v1';
    }
    if (config.url && (config.url.startsWith('http://localhost') || config.url.startsWith('http://127.0.0.1'))) {
      config.url = config.url.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
    }
  }

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
