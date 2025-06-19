import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/statistics`;

const api = axios.create({
  baseURL: API_URL,
});
// Thêm token vào header 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; //xoá header nếu không có token
  }
  return config;
});

export const getUserGrowth = async (months = 3) => 
    api.get('/user-growth', { params: { months } });