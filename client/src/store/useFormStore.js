// client/src/store/useFormStore.js
import { create } from 'zustand';
import axios from 'axios';

const useFormStore = create((set) => ({
  forms: [],
  form: null,
  loading: false,
  error: null,
  createForm: async (formData, token) => {
    set({ loading: true, error: null });
    try {
      console.log('createForm - Sending token:', token);
      const response = await axios.post(
        'http://localhost:5000/api/forms',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      set((state) => ({
        forms: [...state.forms, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create form';
      console.error('createForm error:', errorMsg);
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },
  fetchFormById: async (id) => {
    set({ loading: true, error: null });
    try {
      console.log('fetchFormById - Fetching form ID:', id);
      const response = await axios.get(`http://localhost:5000/api/forms/${id}`);
      set({ form: response.data, loading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch form';
      console.error('fetchFormById error:', errorMsg);
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },
  fetchForms: async (token) => {
    set({ loading: true, error: null });
    try {
      console.log('fetchForms - Sending token:', token);
      const response = await axios.get('http://localhost:5000/api/forms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ forms: response.data, loading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch forms';
      console.error('fetchForms error:', errorMsg);
      set({ error: errorMsg, loading: false });
    }
  },
}));

export default useFormStore;