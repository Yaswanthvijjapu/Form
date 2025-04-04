// client/src/api/responseApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const submitResponse = async (formId, answers) => {
  const response = await axios.post(`${API_URL}/responses/${formId}`, { answers });
  return response.data;
};

export const getResponses = async (formId, token) => {
  const response = await axios.get(`${API_URL}/responses/${formId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const exportResponses = async (formId, token) => {
  const response = await axios.get(`${API_URL}/responses/export/${formId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // For CSV download
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'responses.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};