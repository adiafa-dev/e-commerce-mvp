import api from '@/lib/axios';

export const authApi = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string; avatarUrl?: string }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) => api.post('/auth/login', data),

  me: () => api.get('/auth/me'), // kalau ada endpoint ini di API kamu
};
