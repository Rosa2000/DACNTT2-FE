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
  api.get('/', {
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

// cập nhật bài tập
export const updateExercise = (id, data) =>
  api.put(`/${id}`, data);

// Tạo bài tập mới
export const createExercise = (data) =>
  api.post('/', data);

// Xóa mềm bài tập
export const deleteExercise = (id) =>
  api.delete(`/${id}`);

// Khôi phục bài tập
export const restoreExercise = (id) =>
  api.patch(`/${id}/restore`);

export const getExercisesByLessonId = async (lessonId) => {
  return api.get('', {
    params: { lesson_id: lessonId }
  });
};

// Gửi kết quả bài làm (1 hoặc nhiều)
export const doExercise = (results, userId) => {
  return api.post('/do_exercise', results, {
    params: { user_id: userId } 
  });
};

// Lấy danh sách xếp hạng
export const getRankingList = () =>
  api.get('/ranking_list');

// Lấy danh sách xếp hạng của người dùng
export const getRankingListUser = () =>
  api.get('/ranking_list_user');

export default api;
