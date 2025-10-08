'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRelatedProducts } from '@/hooks/useRelatedProducts';

type Props = {
  categoryId: number;
  excludeId?: number;
};

export default function RelatedProducts({ categoryId, excludeId }: Props) {
  const { data, isLoading, error } = useRelatedProducts(categoryId, excludeId);

  if (isLoading) {
    return (
      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-neutral-500 italic">Gagal memuat produk terkait 😢</p>;
  }

  const filtered = data?.data?.products ?? [];
  const products = filtered.filter((p) => p.id !== excludeId).slice(0, 4);

  if (!products.length) {
    return <p className="text-neutral-500 italic">Belum ada produk serupa di kategori ini 😌</p>;
  }

  return (
    <div id="productListWrapper" className="grid gap-5 grid-cols-2 md:grid-cols-4">
      {products.map((item) => (
        <div key={item.id} className="item-card border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition duration-300">
          <div>
            <Image src={item.images?.[0] || '/assets/images/no-image.png'} alt={item.title} width={300} height={300} className="w-full h-[200px] object-cover" unoptimized />
          </div>
          <div className="p-5">
            <Link href={`/product/${item.id}`} className="text-sm md:text-base hover:text-primary hover:scale-105 transition duration-500 block font-medium line-clamp-1">
              {item.title}
            </Link>
            <p className="text-base font-bold py-1">Rp {item.price.toLocaleString('id-ID')}</p>
            <p className="text-base flex gap-2 items-center text-neutral-700">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {item.rating?.toFixed(1) || '0.0'} • {item.soldCount}
            </p>
            <div className="flex gap-3">
              <Image src="/assets/images/icons/verified.svg" alt="verified" width={18} height={18} />
              <p className="text-base text-neutral-700 leading-tight">{item.shop.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
