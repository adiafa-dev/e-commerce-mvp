'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
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

type RelatedResponse = {
  success: boolean;
  message: string;
  data: {
    products: Product[];
  };
};

/**
 * Ambil produk terkait berdasarkan kategori
 */
export function useRelatedProducts(categoryId: number, excludeId?: number) {
  return useQuery<RelatedResponse>({
    queryKey: ['related-products', categoryId, excludeId],
    queryFn: async () => {
      const { data } = await api.get(`/products?categoryId=${categoryId}&limit=6`);
      if (!data.success) throw new Error('Gagal memuat produk terkait');
      return data;
    },
    enabled: !!categoryId,
  });
}
