'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  category: { id: number; name: string; slug: string };
  shop: { id: number; name: string; logo: string; address: string };
};

type ProductResponse = {
  success: boolean;
  message: string;
  data: Product;
};

export function useProductDetail(id: string) {
  return useQuery<ProductResponse>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      console.log('✅ Product detail response:', data);
      return data;
    },
    enabled: !!id,
  });
}
