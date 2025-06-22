import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/lessons`;

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
    if (error.response?.status === 401 || error.response?.data?.code === -3) {
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định từ server';
    return Promise.reject({ ...error, message: errorMessage });
  }
);

export const getLessons = (params) =>
  api.get('/', {
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      filters: params.filters || '',
      level: params.level,
      category: params.category,
      status_id: params.status_id,
      type: params.type
    }
  });

// Lấy chi tiết 1 bài học
export const getLessonById = (id) =>
  api.get('/', { params: { id } });

// Tạo bài học mới
export const createLesson = (data) =>
  api.post('/', data);

// Cập nhật bài học
export const updateLesson = (id, data) =>
  api.put(`/${id}`, data);

// Xoá mềm bài học
export const deleteLesson = (id) =>
  api.delete(`/${id}`);

// Khôi phục bài học
export const restoreLesson = (id) =>
  api.patch(`/restore/${id}`);

// Học bài
export const studyLesson = ({ user_id, lesson_id, status_id = 4 }) =>
  api.post('/study', { lesson_id, status_id }, { params: { user_id } });

// Lấy danh sách bài học đã học của user
export const getUserLessons = (params) =>
  api.get('/user-lessons', { params });


export default api;