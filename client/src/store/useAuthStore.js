// client/src/store/useAuthStore.js
import { create } from 'zustand';
import { register, login } from '../api/authApi';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
  login: async (email, password) => {
    try {
      const response = await login(email, password);
      const token = response.token;
      if (!token) throw new Error('No token received from login');
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, error: null });
      console.log('Login successful, token:', token);
    } catch (err) {
      set({ error: err.response?.data?.error || 'Login failed', isAuthenticated: false });
      console.error('Login error:', err);
      throw err;
    }
  },
  register: async (email, password) => {
    try {
      const response = await register(email, password);
      const token = response.token;
      if (!token) throw new Error('No token received from register');
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, error: null });
      console.log('Register successful, token:', token);
    } catch (err) {
      set({ error: err.response?.data?.error || 'Registration failed', isAuthenticated: false });
      console.error('Register error:', err);
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;