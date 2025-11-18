import axios from 'axios';

// Base URL of your backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const snippetAPI = {
  getMySnippets: () => api.get('/snippets/my'),
  getPublicSnippets: () => api.get('/snippets/public'),
  createSnippet: (data) => api.post('/snippets', data),
  updateSnippet: (id, data) => api.put(`/snippets/${id}`, data),
  deleteSnippet: (id) => api.delete(`/snippets/${id}`),
  toggleFavorite: (id) => api.patch(`/snippets/${id}/favorite`),
  getFavorites: () => api.get('/snippets/favorites'),
  search: (keyword) => api.get(`/snippets/search?keyword=${keyword}`),
  searchPublic: (keyword) => api.get(`/snippets/public/search?keyword=${keyword}`),
};

export default api;