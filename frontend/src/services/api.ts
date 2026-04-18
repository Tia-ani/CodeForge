import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeforge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Problem API
export const problemAPI = {
  getAll: () => api.get('/problems'),
  getById: (id: number) => api.get(`/problems/${id}`),
};

// Submission API
export const submissionAPI = {
  submit: (data: { problemId: number; language: string; code: string }) =>
    api.post('/submissions', data),
  getMySubmissions: () => api.get('/submissions'),
  getForProblem: (problemId: number) =>
    api.get(`/submissions/problem/${problemId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getAll: () => api.get('/leaderboard'),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
};

export default api;
