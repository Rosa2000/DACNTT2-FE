import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/exercises`;

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

export const updateExercise = (id, data) =>
  api.put(`/${id}`, data);

export const createExercise = (data) =>
  api.post('/', data);

export const deleteExercise = (id) =>
  api.delete(`/${id}`);

export const restoreExercise = (id) =>
  api.patch(`/${id}/restore`);

export const getExercisesByLessonId = (lessonId) => {
  return api.get('/', { params: { lesson_id: lessonId } });
};

export const doExercise = (results, userId) => {
  return api.post('/do-exercise', results, {
    params: { user_id: userId }
  });
};

export const getRankingList = () =>
  api.get('/ranking-list');

export const getRankingListUser = () =>
  api.get('/ranking-list-user');

export default api;
