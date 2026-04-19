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

/**
 * Helper: all API responses are now wrapped in { success, data, error, timestamp }.
 * This interceptor unwraps success responses so components get `res.data` directly.
 */
api.interceptors.response.use(
  (response) => {
    // If the API uses the DTO wrapper, unwrap it
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Extract error message from DTO wrapper
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

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
  getTagCounts: () => api.get('/problems/tags'),
};

// Submission API
export const submissionAPI = {
  run: (data: { problemId: number; language: string; code: string; input: string }) =>
    api.post('/submissions/run', data),
  submit: (data: { problemId: number; language: string; code: string }) =>
    api.post('/submissions', data),
  getTrace: (submissionId: number) =>
    api.get(`/submissions/${submissionId}/trace`),
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
