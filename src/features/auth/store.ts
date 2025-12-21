import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  role: string;
}

interface JwtPayload {
  id: number;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        console.log('Logging in with', email, password);
        const response = await api.post('/auth/login', { email, password });
        console.log('Login response:', response.data);
        const token =
          response.data.data?.token ||
          response.data.token ||
          response.data.access_token ||
          response.data.jwt;
        if (!token || typeof token !== 'string') {
          console.error('Token not found in response. Available keys:', Object.keys(response.data));
          throw new Error('Invalid token received from server');
        }
        console.log('Token:', token);
        this.token = token;
        localStorage.setItem('token', token);
        this.decodeUser(token);
        this.isAuthenticated = true;
        console.log('Login successful, user:', this.user);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },

    loadUserFromStorage() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          this.decodeUser(token);
          this.token = token;
          this.isAuthenticated = true;
        } catch {
          this.logout();
        }
      }
    },

    decodeUser(token: string) {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded JWT:', decoded);
      this.user = {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
      };
      console.log('Set user:', this.user);
    },
  },
});
