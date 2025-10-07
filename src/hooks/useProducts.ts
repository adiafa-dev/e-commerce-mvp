// 'use client';

// import { useQuery } from '@tanstack/react-query';

// export type Product = {
//   id: number;
//   title: string;
//   slug: string;
//   price: number;
//   images: string[];
//   rating: number;
//   reviewCount: number;
// };

// type ProductResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     products: Product[];
//     pagination: {
//       page: number;
//       limit: number;
//       total: number;
//       totalPages: number;
//     };
//   };
// };

// export function useProducts(page = 1, limit = 8) {
//   return useQuery<ProductResponse>({
//     queryKey: ['products', page],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products?page=${page}&limit=${limit}`, { cache: 'no-store' });
//       if (!res.ok) throw new Error('Gagal memuat produk');
//       return res.json();
//     },
//   });
// }
'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/axios';

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
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

export function useProducts(page = 1, limit = 8) {
  return useQuery<ProductResponse>({
    queryKey: ['products', page],
    queryFn: async () => {
      const res = await api.get<ProductResponse>(`/products?page=${page}&limit=${limit}`);
      return res.data;
    },
    placeholderData: keepPreviousData, // ✅ versi baru React Query v5
  });
}
