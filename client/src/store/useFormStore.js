// client/src/store/useFormStore.js
import { create } from 'zustand';
import { getForms, createForm as apiCreateForm, getFormById, getFormByShareLink, deleteForm as apiDeleteForm, updateForm as apiUpdateForm } from '../api/formApi';
import { getResponses as apiGetResponses } from '../api/responseApi';
import useAuthStore from './useAuthStore';

const useFormStore = create((set) => ({
  forms: [],
  form: null,
  responses: [],
  loading: false,
  error: null,
  fetchForms: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getForms(token);
      set({ forms: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch forms', loading: false });
      console.error('Fetch forms error:', err);
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
      const { token } = useAuthStore.getState();
      const data = await getFormById(id, token);
      set({ form: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch form', loading: false });
      console.error('Fetch form error:', err);
    }
  },
  fetchFormByShareLink: async (shareLink) => {
    set({ loading: true, error: null });
    try {
      const data = await getFormByShareLink(shareLink);
      set({ form: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch form by share link', loading: false });
      console.error('Fetch form by share link error:', err);
    }
  },
  fetchResponses: async (formId) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const data = await apiGetResponses(formId, token);
      set({ responses: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch responses', loading: false });
      console.error('Fetch responses error:', err);
    }
  },
  deleteForm: async (formId, token) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteForm(formId, token);
      set((state) => ({
        forms: state.forms.filter((form) => form._id !== formId),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to delete form', loading: false });
      console.error('Delete form error:', err);
    }
  },
  updateForm: async (formId, formData, token) => {
    set({ loading: true, error: null });
    try {
      const updatedForm = await apiUpdateForm(formId, formData, token);
      set((state) => ({
        forms: state.forms.map((form) =>
          form._id === formId ? { ...form, ...updatedForm } : form
        ),
        form: updatedForm,
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to update form', loading: false });
      console.error('Update form error:', err);
    }
  },
}));

export default useFormStore;