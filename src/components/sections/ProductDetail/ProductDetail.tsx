'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useProductDetail } from '@/hooks/useProductDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { format } from 'date-fns/format';
import RelatedProducts from '../RelatedProducts';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function ProductDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useProductDetail(id);
  const { data: reviewsData, isLoading: loadingReviews } = useReviews(id);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useAuth();

  if (isLoading)
    return (
      <div className="p-10 space-y-5">
        <Skeleton className="w-full h-[400px] rounded-xl" />
        <Skeleton className="w-1/3 h-8" />
        <Skeleton className="w-1/4 h-6" />
        <Skeleton className="w-full h-20" />
      </div>
    );

  if (error || !data?.data) return <div className="text-center text-red-500 py-10">Gagal memuat produk 😢</div>;

  const product = data.data;
  const images = product.images?.length ? product.images : ['/assets/images/no-image.png'];
  const currentImage = mainImage || images[0];

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to your cart!');
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must login first!');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          qty: quantity,
        }),
      });

      const data = await res.json();
      console.log('🛒 Add to cart response:', data);

      if (!res.ok || !data.success) throw new Error(data.message || 'Gagal menambahkan ke cart');

      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`${product.title} berhasil ditambahkan ke cart!`);
    } catch (err) {
      console.error('❌ Add to cart error:', err);
      toast.error('Gagal menambahkan ke cart');
    }
  };

  return (
    <section id="prodDetailsWrapper" className="w-full md:w-[1200px] mx-auto py-4 md:py-8 px-4 md:px-0">
      {/* === BREADCRUMB === */}
      <div className="py-2 md:py-5" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex text-xs md:text-base">
          <li className="flex items-center">
            <Link href="/" className="text-neutral-950 font-semibold hover:text-primary">
              Home
            </Link>
            <span className="mx-2 text-neutral-950">{'>'}</span>
          </li>
          <li className="flex items-center">
            <Link href="/categories" className="text-neutral-950 font-semibold hover:text-primary">
              {product.category.name}
            </Link>
            <span className="mx-2 text-neutral-950">{'>'}</span>
          </li>
          <li className="flex items-center">
            <span className="text-neutral-950">{product.title}</span>
          </li>
        </ol>
      </div>

      {/* === DETAIL PRODUK === */}
      <div className="flex flex-col md:flex-row gap-5 items-start pb-12">
        {/* === Gambar Produk === */}
        <div className="w-full md:w-1/3 rounded-xl overflow-hidden">
          <div id="imageProdMain" className="rounded-xl overflow-hidden border border-neutral-200">
            <Image src={currentImage} alt={product.title} width={500} height={500} className="rounded-xl object-cover w-full h-[400px]" unoptimized />
          </div>

          {/* Thumbnail */}
          <div id="thumbProductWrapper" className="flex w-full gap-1 pt-5 flex-wrap">
            {images.map((img, i) => (
              <button key={i} onClick={() => setMainImage(img)} className={`cursor-pointer group border-2 rounded-2xl transition duration-500 ${img === currentImage ? 'border-neutral-950' : 'border-transparent hover:border-neutral-950'}`}>
                <Image src={img} alt={`Thumbnail ${i}`} width={72} height={72} className="aspect-square h-auto object-cover rounded-2xl group-hover:scale-95 transition duration-500" unoptimized />
              </button>
            ))}
          </div>
        </div>

        {/* === Deskripsi Produk === */}
        <div className="w-full md:w-2/3">
          <div className="w-full border-neutral-300 border-b pb-4">
            <h4 className="text-base md:text-xl font-semibold">{product.title}</h4>
            <p className="text-xl md:text-[32px] font-bold py-2">Rp {product.price.toLocaleString('id-ID')}</p>
            <p className="text-sm md:text-lg font-semibold flex gap-2 mb-5 items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {product.rating.toFixed(1)} ({product.reviewCount})
            </p>
          </div>

          {/* Deskripsi Produk */}
          <div className="clear-both border-neutral-300 border-b pb-5">
            <h4 className="text-base md:text-xl font-semibold mt-4">Deskripsi</h4>

            <p className="text-sm md:text-base py-5 whitespace-pre-line">{product.description}</p>
            <ul className="text-sm md:text-base list-disc pl-6 space-y-1 text-neutral-700">
              <li>Stock: {product.stock}</li>
              <li>Terjual: {product.soldCount}</li>
              {/* <li>Kategori: {product.category.name}</li> */}
            </ul>
          </div>

          {/* Section Toko */}
          <div className="flex justify-between items-center border-neutral-300 border-b py-5">
            <div className="flex gap-5 items-center max-w-2/3">
              <div className="rounded-full overflow-hidden border-neutral-300 border w-16 aspect-square flex justify-center items-center">
                <Image
                  src={product.shop.logo && product.shop.logo.trim() !== '' ? product.shop.logo : '/assets/images/icons/store.svg'} // ✅ fallback aman
                  alt={product.shop.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm md:text-base font-semibold">{product.shop.name} </h4>
                <p className="text-sm md:text-sm py-1">{product.shop.address}</p>
              </div>
            </div>
            <div className="w-1/4">
              <Link href="/product" className="cursor-pointer flex items-center justify-center px-2 md:px-12 gap-2.5 text-sm border-neutral-300 border rounded-md hover:bg-primary transition duration-500 h-12">
                <span className="md:block text-base font-semibold text-center">See Store</span>
              </Link>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col items-start gap-5 py-5">
            <div className="flex items-center gap-10">
              <p className="text-base font-semibold">Quantity</p>
              <div className="flex items-center border border-neutral-300 rounded-xl px-4 py-2 w-fit">
                <button className="text-lg font-bold px-2 cursor-pointer" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <span className="mx-4 text-lg font-medium">{quantity}</span>
                <button className="text-lg font-bold px-2 cursor-pointer" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="flex">
              <Button
                type="button"
                onClick={handleAddToCart}
                className="cursor-pointer flex items-center justify-center gap-2 bg-black text-white px-20 py-3 rounded-md hover:bg-primary hover:text-black hover:scale-105 duration-500 transition w-full md:w-auto h-10"
              >
                <span className="text-lg">+</span>
                <span>Add to Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* === Review Section === */}
      <div id="reviewSection" className="py-10 border-t border-neutral-300 mt-8">
        <h4 className="text-xl md:text-2xl font-bold mb-6">Product Reviews</h4>
        <p className="text-sm md:text-lg font-semibold flex gap-2 mb-5 items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {product.rating.toFixed(1)} / 5.0
        </p>

        {loadingReviews ? (
          <div className="space-y-3">
            <Skeleton className="w-full h-16 rounded-lg" />
            <Skeleton className="w-full h-16 rounded-lg" />
            <Skeleton className="w-full h-16 rounded-lg" />
          </div>
        ) : reviewsData?.data?.reviews?.length ? (
          <div className="space-y-5">
            {reviewsData.data.reviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-300 p-5 hover:shadow-sm transition duration-300">
                <div className="flex flex-col items-start gap-3">
                  {/* === USER INFO === */}
                  <div className="flex items-center gap-3">
                    <Image src={review.user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt={review.user.name} width={40} height={40} className="rounded-full border border-neutral-300" unoptimized />
                    <div>
                      <p className="font-semibold text-sm md:text-base">{review.user.name}</p>
                      <p className="text-xs text-neutral-500">{format(new Date(review.createdAt), 'd MMM yyyy, hh:mm')}</p>
                    </div>
                  </div>

                  {/* === RATING === */}
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.star ? 'fill-yellow-400' : 'fill-neutral-300'}`} />
                    ))}
                  </div>
                </div>

                {/* === COMMENT === */}
                <p className="text-neutral-700 text-sm md:text-base mt-3">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 italic">Belum ada review untuk produk ini 😌</p>
        )}
      </div>

      {/* === Related Product Section === */}
      <div id="relatedProdSection" className="py-8 border-neutral-300 border-t">
        <h4 className="w-full text-xl md:text-[32px] font-bold mb-8">Related Products</h4>

        {product.category?.id ? <RelatedProducts categoryId={product.category.id} excludeId={product.id} /> : <p className="text-neutral-500 italic">Kategori produk tidak ditemukan 😅</p>}
      </div>
    </section>
  );
}
