// client/src/api/formApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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