// client/src/api/authApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password });
  return response.data; // { token }
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data; // { token }
};