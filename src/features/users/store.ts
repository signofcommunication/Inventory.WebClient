import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { AxiosError } from 'axios';
import type { User, CreateUserPayload, UpdateUserPayload } from './types';

interface UsersState {
  users: User[];
  loading: boolean;
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    loading: false,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get('/users');
        this.users = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        if (err.response?.status === 403) {
          throw new Error('Forbidden: You do not have permission to access this resource.');
        } else if (err.response?.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else {
          throw new Error('Failed to fetch users.');
        }
      } finally {
        this.loading = false;
      }
    },

    async createUser(payload: CreateUserPayload) {
      try {
        const response = await api.post('/users', payload);
        this.users.push(response.data.data || response.data);
      } catch (error: unknown) {
        console.error('Error creating user:', error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            throw new Error('Forbidden: You do not have permission to create users.');
          } else if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else {
            throw new Error('Failed to create user.');
          }
        } else {
          throw new Error('Failed to create user.');
        }
      }
    },

    async updateUser(id: number, payload: UpdateUserPayload) {
      try {
        const response = await api.put(`/users/${id}`, payload);
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...response.data.data };
        }
      } catch (error: unknown) {
        console.error('Error updating user:', error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            throw new Error('Forbidden: You do not have permission to update users.');
          } else if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else {
            throw new Error('Failed to update user.');
          }
        } else {
          throw new Error('Failed to update user.');
        }
      }
    },

    async toggleUserStatus(id: number, isActive: boolean) {
      try {
        await api.put(`/users/${id}/status`, { isActive });
        const user = this.users.find((u) => u.id === id);
        if (user) {
          user.isActive = isActive;
        }
      } catch (error: unknown) {
        console.error('Error toggling user status:', error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            throw new Error('Forbidden: You do not have permission to change user status.');
          } else if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else {
            throw new Error('Failed to change user status.');
          }
        } else {
          throw new Error('Failed to change user status.');
        }
      }
    },

    async deleteUser(id: number) {
      try {
        await api.delete(`/users/${id}`);
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error: unknown) {
        console.error('Error deleting user:', error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 403) {
            throw new Error('Forbidden: You do not have permission to delete users.');
          } else if (error.response?.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else {
            throw new Error('Failed to delete user.');
          }
        } else {
          throw new Error('Failed to delete user.');
        }
      }
    },
  },
});
