'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export type Category = {
  id: number;
  name: string;
  slug: string;
};

type CategoriesResponse = {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export function useCategories() {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // cache 10 menit
  });
}
