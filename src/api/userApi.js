import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/users`;

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
}
);
// Response interceptor để xử lý lỗi 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.data?.code === -3) {
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định từ server';
    return Promise.reject({ ...error, message: errorMessage });
  }
);

// Lấy danh sách người dùng
export const getUsers = (params) =>
  api.get('/', { params });

// Tạo người dùng
export const createUser = (data) =>
  api.post('/', data);

// Lấy chi tiết người dùng
export const getUserById = (id) =>
  api.get(`/${id}`);

// Cập nhật người dùng
export const updateUser = (id, data) =>
  api.put(`/${id}`, data);

// Cập nhật mật khẩu người dùng
export const updateUserPassword = (id, data) =>
  api.put(`/${id}/password`, data);

// Xoá người dùng
export const deleteUser = (id) =>
  api.delete(`/${id}`);

// Khôi phục người dùng
export const restoreUser = (id) =>
  api.put(`/${id}/restore`);

export default api;

