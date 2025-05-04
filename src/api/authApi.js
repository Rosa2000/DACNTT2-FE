import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/auth_management`;

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

// Response interceptor để xử lý lỗi 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
        if (error.response?.status === 401|| error.response?.data?.code === -3) {
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định từ server';
    return Promise.reject({ ...error, message: errorMessage });
  }
);

export const login = (username, password) =>
  api.post('/login', { username, password });

export const loginWithGoogle = (email) =>
  api.post('/login-oauth', { email });

export const logout = () =>
  api.post('/logout');

export const forgotPassword = (data) =>
  api.post('/forgot-password', data);

export const register = (data) =>
  api.post('/register', data);

export const verifyLogin = () =>
  api.get('/verify_login');

export const verifyEmail = (token) =>
  api.get(`/verify-email?token=${token}`);

export default api;