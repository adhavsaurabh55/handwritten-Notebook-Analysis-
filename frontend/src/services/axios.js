import axios from 'axios';

/**
 * Axios Instance — Centralized HTTP client with JWT interceptor.
 *
 * - Base URL: Change API_BASE_URL to your backend endpoint when ready.
 * - Request interceptor: Automatically attaches the JWT from localStorage
 *   to every outgoing request as an Authorization header.
 * - Response interceptor: If a 401 response is received, the token is
 *   cleared and the user is redirected to /login.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ───────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 (Unauthorized), clear auth state
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login (only if not already there to avoid loops)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

