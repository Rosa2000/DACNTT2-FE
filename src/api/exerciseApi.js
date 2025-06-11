import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/exercise`;

const api = axios.create({
  baseURL: API_URL,
});

// Thêm token vào header 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Lấy danh sách bài tập
export const getExercises = (params) =>
  api.get('/data_exercises', {
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      filters: params.filters || '',
      status_id: params.status_id,
      type: params.type,
      lessonId: params.lessonId,
      id: params.id,
    }
  });

// Khôi phục/cập nhật bài tập
export const updateExercise = (id, data) =>
  api.post('/edit_exercise', data, { params: { id } });

// Tạo bài tập mới
export const createExercise = (data) =>
  api.post('/add_exercise', data);

// Xóa mềm bài tập
export const deleteExercise = (id) =>
  api.post('/delete_exercise', null, { params: { id } });

// Khôi phục bài tập
export const restoreExercise = (id) =>
  api.post('/restore_exercise', null, { params: { id } });

export const getExercisesByLessonId = async (lessonId) => {
  return api.get('/data_exercises', {
    params: { lesson_id: lessonId }
  });
};

// Gửi kết quả bài làm (1 hoặc nhiều)
export const doExercise = (results, userId) => {
  return api.post('/do_exercise', results, {
    params: { user_id: userId } 
  });
};

export default api;
