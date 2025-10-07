import api from '@/lib/axios';

export const productApi = {
  getAll: (page = 1, limit = 8) => api.get(`/products?page=${page}&limit=${limit}`),

  getById: (id: number | string) => api.get(`/products/${id}`),

  search: (query: string) => api.get(`/products/search?q=${query}`),

  getByCategory: (category: string, page = 1, limit = 8) => api.get(`/products/category/${category}?page=${page}&limit=${limit}`),
};
