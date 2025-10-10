'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutFailedPage() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        <div className="relative w-24 h-24">
          <Image
            src="/assets/images/error-cross.png" // ✅ ganti sesuai icon error kamu
            alt="Failed"
            width={96}
            height={96}
            unoptimized
          />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-neutral-900">Oops, something went wrong</h2>
          <p className="text-neutral-600 text-sm md:text-base mt-2">Something went wrong during checkout. Please review your details and retry.</p>
        </div>
        <Link href="/checkout">
          <Button className="bg-black text-white hover:bg-primary hover:text-black cursor-pointer">Back to Cart</Button>
        </Link>
      </div>
    </section>
  );
}
