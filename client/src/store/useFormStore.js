// client/src/store/useFormStore.js
import { create } from 'zustand';
import { createForm, getForms, getFormById } from '../api/formApi';

const useFormStore = create((set) => ({
  forms: [],
  currentForm: null,
  loading: false,
  error: null,

  fetchForms: async (token) => {
    set({ loading: true, error: null });
    try {
      const forms = await getForms(token);
      set({ forms, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch forms', loading: false });
    }
  },

  fetchFormById: async (id, token) => {
    set({ loading: true, error: null });
    try {
      const form = await getFormById(id, token);
      set({ currentForm: form, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch form', loading: false });
    }
  },

  createForm: async (formData, token) => {
    set({ loading: true, error: null });
    try {
      const form = await createForm(formData, token);
      set((state) => ({ forms: [...state.forms, form], loading: false }));
      return form;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create form', loading: false });
      throw error;
    }
  },

  clearCurrentForm: () => set({ currentForm: null }),
}));

export default useFormStore;