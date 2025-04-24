// client/src/api/formApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createForm = async (formData, token) => {
  const response = await axios.post(`${API_URL}/forms`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getForms = async (token) => {
  const response = await axios.get(`${API_URL}/forms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFormById = async (id, token) => {
  const response = await axios.get(`${API_URL}/forms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFormByShareLink = async (shareLink) => {
  const response = await axios.get(`${API_URL}/forms/share/${shareLink}`);
  return response.data;
};

export const deleteForm = async (formId, token) => {
  const response = await axios.delete(`${API_URL}/forms/${formId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateForm = async (formId, formData, token) => {
  const response = await axios.put(`${API_URL}/forms/${formId}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};