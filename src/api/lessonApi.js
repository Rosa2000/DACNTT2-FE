import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/lesson`;

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
  api.get('/data_lessons', { 
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      filters: params.filters || '',
      level: params.level,
      category: params.category,
      status_id: params.status_id
    }
  });

export const getLessonById = (id) => 
  api.get('/data_lessons', { params: { id } });

export const createLesson = (data) => 
  api.post('/add_lesson', data);

export const updateLesson = (id, data) => 
  api.put('/edit_lesson', data, { params: { id } });

export const deleteLesson = (id) => 
  api.delete('/delete_lesson', { params: { id } });

export const restoreLesson = (id) => {
  return api.post('/restore_lesson', null, { params: { id } });
};

export const studyLesson = (studyData) => {
  const { user_id, lesson_id, status_id = 4 } = studyData;
  return api.post(`/study`, { lesson_id, status_id}, {params: { user_id } });
};

export const getUserLessons = (params) => {
  return api.get('/user_lessons', { params });
};

export default api;