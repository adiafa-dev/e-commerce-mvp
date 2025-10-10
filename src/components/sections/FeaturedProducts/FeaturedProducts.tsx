'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

type FeaturedProductsProps = {
  filters?: {
    categories: number[];
    minPrice: number;
    maxPrice: number;
    rating: number[];
  };
  sortOption?: 'latest' | 'name' | 'price' | 'rating';
  onCountChange?: (count: number) => void;
};

export default function FeaturedProducts({ filters, sortOption = 'latest', onCountChange }: FeaturedProductsProps) {
  const [page, setPage] = useState(1);
  const limit = 16;

  // 🔹 Bangun parameter untuk API
  const apiFilters: Record<string, string | number | (string | number)[]> = {};
  if (filters?.categories?.length) apiFilters.categoryId = filters.categories;
  if (filters?.minPrice && filters.minPrice > 0) apiFilters.minPrice = filters.minPrice;
  if (filters?.maxPrice && filters.maxPrice < 5000000) apiFilters.maxPrice = filters.maxPrice;

  const { data, isLoading, isFetching, error } = useProducts(page, limit, apiFilters);

  const products = useMemo(() => data?.data?.products ?? [], [data?.data?.products]);

  // 🔹 Filter By Ratings
  const filteredProducts = useMemo(() => {
    if (!filters?.rating?.length) return products;
    const minSelectedRating = Math.min(...filters.rating);
    return products.filter((p) => p.rating >= minSelectedRating);
  }, [products, filters?.rating]);

  // 🔹 Sorting logic
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortOption) {
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
      default:
        sorted.sort((a, b) => b.id - a.id); // asumsi ID tertinggi adalah terbaru
        break;
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  // 🔹 Scroll ke atas setiap ganti halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // ✅ Update jumlah produk ke parent
  useEffect(() => {
    if (onCountChange) {
      onCountChange(filteredProducts.length);
    }
  }, [filteredProducts, onCountChange]);

  // === Kondisi UI ===
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-10">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Gagal memuat produk 😢</div>;
  }

  // === TAMPILAN PRODUK ===
  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
          {sortedProducts.map((product) => (
            <div key={product.id} className="item-card border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-500">
              <div className="overflow-hidden">
                <Image
                  src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="w-full h-[250px] object-cover hover:scale-105 transition duration-500"
                  unoptimized
                />
              </div>
              <div className="p-5">
                <Link href={`/product/${product.id}`} className="text-sm md:text-base hover:text-primary hover:scale-105 transition duration-500 block font-medium line-clamp-1 cursor-pointer">
                  {product.title}
                </Link>
                <p className="text-sm md:text-base font-bold py-1">Rp {product.price.toLocaleString('id-ID')}</p>
                <p className="text-sm md:text-base flex gap-2 items-center text-neutral-700">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {product.rating?.toFixed(1) || '0.0'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* === PAGINATION === */}
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          <Button
            variant="outline"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer h-10 border border-neutral-300 text-neutral-950 rounded-xl font-semibold hover:bg-primary hover:scale-105 transition duration-500"
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <Button
                key={pageNumber}
                variant={page === pageNumber ? 'default' : 'outline'}
                onClick={() => setPage(pageNumber)}
                disabled={isFetching}
                className={`cursor-pointer w-10 h-10 rounded-xl font-semibold ${
                  page === pageNumber ? 'bg-neutral-950 text-white hover:bg-primary hover:text-black' : 'border border-neutral-300 text-neutral-950 hover:bg-primary transition duration-500'
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer h-10 border border-neutral-300 text-neutral-950 rounded-xl font-semibold hover:bg-primary hover:scale-105 transition duration-500"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
