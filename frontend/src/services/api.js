import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests and handle Content-Type
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Let axios set Content-Type automatically for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Documents API
export const documentsAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    // Axios auto-detects FormData and sets Content-Type with boundary
    return api.post('/documents/upload', formData);
  },
  getAll: (page = 1, limit = 10) => api.get(`/documents?page=${page}&limit=${limit}`),
  getOne: (id) => api.get(`/documents/${id}`),
  delete: (id) => api.delete(`/documents/${id}`),
  downloadUrl: (id) => api.get(`/documents/${id}/download`),
};

// Stripe API
export const stripeAPI = {
  createCheckout: () => api.post('/stripe/create-checkout'),
  getSubscription: () => api.get('/stripe/subscription'),
  cancelSubscription: () => api.post('/stripe/cancel-subscription'),
};

export default api;
