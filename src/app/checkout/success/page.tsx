'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        <div className="relative w-24 h-24">
          <Image
            src="/assets/images/success-check.png" // ✅ ganti sesuai icon success kamu
            alt="Success"
            width={96}
            height={96}
            unoptimized
          />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-neutral-900">Order Placed Successfully!</h2>
          <p className="text-neutral-600 text-sm md:text-base mt-2">We’ve received your order and will notify you once it’s shipped.</p>
        </div>
        <Link href="/orders">
          <Button className="bg-black text-white hover:bg-primary hover:text-black cursor-pointer">Go to My Orders</Button>
        </Link>
      </div>
    </section>
  );
}
