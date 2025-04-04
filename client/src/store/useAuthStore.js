// client/src/store/useAuthStore.js
import { create } from 'zustand';
import { register, login } from '../api/authApi';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,

  register: async (email, password) => {
    try {
      const { token } = await register(email, password);
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, error: null });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Registration failed' });
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, error: null });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed' });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;