'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export type Review = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
};

type ReviewResponse = {
  success: boolean;
  message: string;
  data: {
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export function useReviews(productId: string) {
  return useQuery<ReviewResponse>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}`);
      return data;
    },
    enabled: !!productId,
  });
}
