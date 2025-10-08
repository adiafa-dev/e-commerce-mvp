'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  category: { id: number; name: string; slug: string };
  shop: { id: number; name: string; slug: string; logo: string };
};

type ProductResponse = {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export function useProducts(
  page = 1,
  limit = 16,
  filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
  }
) {
  return useQuery<ProductResponse>({
    queryKey: ['products', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters?.rating) params.append('rating', String(filters.rating));

      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    },
  });
}
