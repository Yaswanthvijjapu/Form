// client/src/store/useFormStore.js
import { create } from 'zustand';
import { getForms, createForm as apiCreateForm, getFormById } from '../api/formApi';
import useAuthStore from './useAuthStore';

const useFormStore = create((set) => ({
  forms: [],
  form: null,
  loading: false,
  error: null,
  fetchForms: async (token) => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching forms with token:', token);
      const data = await getForms(token);
      console.log('Fetched forms:', data);
      set({ forms: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch forms', loading: false });
      console.error('Fetch forms error:', err.response?.data || err.message);
    }
  },
  createForm: async (formData, token) => {
    set({ loading: true, error: null });
    try {
      const newForm = await apiCreateForm(formData, token);
      set((state) => ({ forms: [...state.forms, newForm], loading: false }));
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to create form', loading: false });
      console.error('Create form error:', err);
    }
  },
  fetchFormById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState(); // Get current token
      if (!token) throw new Error('No authentication token available');
      console.log('Fetching form with id:', id, 'and token:', token);
      const data = await getFormById(id, token); // Pass token
      set({ form: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch form', loading: false });
      console.error('Fetch form error:', err.response?.data || err.message);
    }
  },
}));

export default useFormStore;