// client/src/api/responseApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const submitResponse = async (responseData) => {
  const { formId, responses, shareLink } = responseData;
  const response = await axios.post(`${API_URL}/responses/${formId}`, {
    answers: Object.entries(responses).map(([fieldId, value]) => ({ fieldId, value })),
    shareLink,
  });
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
    responseType: 'blob',
  });
  return response.data;
};