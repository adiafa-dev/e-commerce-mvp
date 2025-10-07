import api from '@/lib/axios';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (data: { productId: number; quantity: number }) => api.post('/cart', data),
  updateCart: (id: number, data: { quantity: number }) => api.put(`/cart/${id}`, data),
  removeFromCart: (id: number) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart/clear'),
};
