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
  category: {
    id: number;
    name: string;
    slug: string;
  };
  shop: {
    id: number;
    name: string;
    slug: string;
    logo: string;
  };
};

export type ProductResponse = {
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

export function useFilteredProducts(filters: { category?: string; minPrice?: number; maxPrice?: number; rating?: number; page?: number; limit?: number }) {
  return useQuery<ProductResponse>({
    queryKey: ['filteredProducts', filters],
    queryFn: async (): Promise<ProductResponse> => {
      const params = new URLSearchParams();

      if (filters.category) params.append('categoryId', filters.category);
      if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters.rating) params.append('rating', String(filters.rating));
      params.append('page', String(filters.page ?? 1));
      params.append('limit', String(filters.limit ?? 16));

      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}
