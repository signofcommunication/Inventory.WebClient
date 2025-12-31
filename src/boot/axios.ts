import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useAuthStore } from 'src/features/auth/store';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error as Error),
);

// Response interceptor to handle 401 and 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Redirect to 403
      if (typeof window !== 'undefined') {
        window.location.href = '/403';
      }
    }
    return Promise.reject(error as Error);
  },
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
