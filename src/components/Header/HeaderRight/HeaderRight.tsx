'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCartCount } from '@/hooks/useCartCount';

// type CartItem = {
//   id: number;
//   title: string;
//   price: number;
//   image?: string;
//   quantity: number;
// };

export default function HeaderRight() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const cartCount = useCartCount();

  // ✅ Ambil cart dari localStorage dan hitung total quantity
  // const calculateCartCount = () => {
  //   try {
  //     const stored = localStorage.getItem('cart');
  //     if (!stored) return 0;
  //     const cart: CartItem[] = JSON.parse(stored);
  //     return cart.reduce((sum, item) => sum + item.quantity, 0);
  //   } catch {
  //     return 0;
  //   }
  // };

  // // ✅ Update saat mount dan ketika localStorage berubah
  // useEffect(() => {
  //   calculateCartCount();

  //   const updateCartCount = () => setCartCount(calculateCartCount());
  //   updateCartCount();

  //   // 🔥 Dengarkan event perubahan cart
  //   window.addEventListener('storage', updateCartCount);

  //   // 🔥 Event custom: supaya bisa update tanpa reload
  //   window.addEventListener('cartUpdated', updateCartCount);

  //   return () => {
  //     window.removeEventListener('storage', updateCartCount);
  //     window.removeEventListener('cartUpdated', updateCartCount);
  //   };
  // }, []);

  return (
    <div className="flex items-center justify-end md:justify-center gap-4 md:w-1/4">
      {/* === CART === */}
      <Link href="/cart" className="relative flex">
        <Image src="/assets/images/icons/cart.svg" alt="Cart" width={22} height={22} className="w-[42px] md:w-[22px]" />
        {cartCount > 0 && <span className="absolute flex justify-center items-center text-xs text-white bg-[#EE1D52] rounded-full font-semibold aspect-square w-6 -top-3 -right-3">{cartCount}</span>}
      </Link>

      {/* === USER STATUS (Desktop) === */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-2.5 border border-neutral-300 rounded-md py-3 px-4 grow hover:bg-neutral-50 transition cursor-pointer">
              <Image src={user.avatar || user.avatarUrl} alt="User Icon" width={24} height={24} className="rounded-full" />
              <span className="text-neutral-950 text-sm">{user.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-neutral-700">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login" className="hidden md:flex items-center gap-2.5 border border-neutral-300 rounded-md py-3 px-4 grow hover:bg-primary transition duration-500">
          <Image src="/assets/images/icons/people.svg" alt="User Icon" width={20} height={20} />
          <span className="text-neutral-950 text-sm">Login</span>
        </Link>
      )}

      {/* === MOBILE MENU (Drawer) === */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-neutral-800">Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-2">
            <Link href="/catalog" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md hover:bg-neutral-100 transition text-sm font-medium text-neutral-800">
              Catalog
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md hover:bg-neutral-100 transition text-sm font-medium text-neutral-800">
              Cart
            </Link>

            {user ? (
              <>
                <Link href="/profile" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md hover:bg-neutral-100 transition text-sm font-medium text-neutral-800">
                  Profile
                </Link>
                <Link href="/orders" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md hover:bg-neutral-100 transition text-sm font-medium text-neutral-800">
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-md hover:bg-red-50 transition text-sm font-medium text-red-600 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md hover:bg-neutral-100 transition text-sm font-medium text-neutral-800">
                Login
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
