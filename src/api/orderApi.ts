import api from '@/lib/axios';

export const orderApi = {
  getOrders: () => api.get('/orders'),
  getOrderById: (id: number) => api.get(`/orders/${id}`),
  createOrder: (data: { addressId: number; paymentMethod: string }) => api.post('/orders', data),
};
