import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: lampirkan JWT token jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cengkihtrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standardisasi error koneksi & token kadaluarsa
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      // Backend mati atau database/server tidak dapat dijangkau
      const netError = new Error(
        'Tidak dapat terhubung ke Backend Server (http://localhost:8080). Pastikan Spring Boot backend sedang berjalan.'
      );
      netError.isNetworkError = true;
      return Promise.reject(netError);
    }

    if (error.response.status === 401) {
      // Token tidak valid atau kedaluwarsa
      localStorage.removeItem('cengkihtrack_token');
      localStorage.removeItem('cengkihtrack_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=1';
      }
    }

    // Ambil pesan error dari ApiResponse server
    const serverMessage = error.response.data?.message || 'Terjadi kesalahan pada server';
    const serverErrors = error.response.data?.errors || null;
    const customError = new Error(serverMessage);
    customError.status = error.response.status;
    customError.errors = serverErrors;
    customError.data = error.response.data;
    return Promise.reject(customError);
  }
);

// API Service Endpoints
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (profileData) => api.put('/api/auth/me', profileData),
};

export const gardenService = {
  getAll: () => api.get('/api/gardens'),
  getById: (id) => api.get(`/api/gardens/${id}`),
  create: (data) => api.post('/api/gardens', data),
  update: (id, data) => api.put(`/api/gardens/${id}`, data),
  delete: (id) => api.delete(`/api/gardens/${id}`),
};

export const harvestService = {
  getAll: () => api.get('/api/harvest-records'),
  getById: (id) => api.get(`/api/harvest-records/${id}`),
  create: (data) => api.post('/api/harvest-records', data),
  update: (id, data) => api.put(`/api/harvest-records/${id}`, data),
  delete: (id) => api.delete(`/api/harvest-records/${id}`),
};

export const saleService = {
  getAll: () => api.get('/api/sales'),
  getById: (id) => api.get(`/api/sales/${id}`),
  create: (data) => api.post('/api/sales', data),
  update: (id, data) => api.put(`/api/sales/${id}`, data),
  delete: (id) => api.delete(`/api/sales/${id}`),
};

export const reportService = {
  getDashboardSummary: () => api.get('/api/dashboard/summary'),
  getReport: (startDate, endDate) => api.get('/api/reports', { params: { startDate, endDate } }),
};
