import axios from 'axios';

const API_URL = 'http://localhost:5055/v1/auth_management';

const api = axios.create({
  baseURL: API_URL,
});
// Thêm token vào header 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor để xử lý lỗi 401
api.interceptors.response.use(
  (response) => {
    console.log('Response từ API:', response); // Debug response
    return response;
  },
  (error) => {
    console.log('Error từ API:', error.response); // Debug lỗi
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Không điều hướng ở đây để tránh xung đột với logic trong authSlice
      return Promise.reject(error);
    }
    const errorMessage = error.response?.data?.message || 'Lỗi không xác định từ server';
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

export default api;