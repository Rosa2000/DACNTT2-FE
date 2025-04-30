import axios from 'axios';

const API_URL = process.env.BASE_URL + 'lesson';

const api = axios.create({
  baseURL: API_URL, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLessons = () => api.get('/lessons');
export const getLessonById = (id) => api.get(`/lessons/${id}`);
export const createLesson = (data) => api.post('/lessons', data);
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lessons/${id}`);