import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://e-commerce-api-production-26ab.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ Tambahkan token otomatis ke setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server';
    console.error('🚨 API Error:', message);
    return Promise.reject({ message });
  }
);

export default api;
