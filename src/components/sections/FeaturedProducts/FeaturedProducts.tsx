'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

export default function FeaturedProducts() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useProducts(page, 16);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-10">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Gagal memuat produk 😢</div>;
  }

  const products = data?.data?.products ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="item-card border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-500">
              {/* Gambar Produk */}
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

              {/* Detail Produk */}
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

        {/* Tombol Load More */}
        {page < totalPages && (
          <div className="w-full flex justify-center mt-12">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={isFetching}
              className="max-w-full w-[220px] h-[48px] border border-neutral-300 text-neutral-950 rounded-xl font-semibold hover:bg-primary hover:scale-105 transition duration-500"
            >
              {isFetching ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
