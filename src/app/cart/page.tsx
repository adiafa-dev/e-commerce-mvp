'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  shop: {
    id: number;
    name: string;
  };
};

type ShopGroup = {
  shopId: number;
  shopName: string;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ tambahan baru

  const loadCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🛒 Loaded cart:', parsed);
        setCart(parsed);
      } else {
        console.log('🪣 Cart kosong di localStorage');
        setCart([]);
      }
    } catch (err) {
      console.error('❌ Gagal parsing cart:', err);
      localStorage.removeItem('cart');
      setCart([]);
    } finally {
      setIsLoading(false); // ✅ selesai loading
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCart();
    }, 300);

    const handleCartUpdate = () => {
      console.log('🔄 cartUpdated event diterima!');
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // === Group by Shop
  const groupedCart: ShopGroup[] = useMemo(() => {
    const groups: { [key: number]: ShopGroup } = {};
    for (const item of cart) {
      if (!groups[item.shop.id]) {
        groups[item.shop.id] = {
          shopId: item.shop.id,
          shopName: item.shop.name,
          items: [],
        };
      }
      groups[item.shop.id].items.push(item);
    }
    return Object.values(groups);
  }, [cart]);

  // === Checkbox Logic
  const isAllSelected = selected.length === cart.length && cart.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(cart.map((item) => item.id));
  };

  const toggleSelectShop = (shopId: number) => {
    const shopItems = groupedCart.find((g) => g.shopId === shopId)?.items ?? [];
    const shopItemIds = shopItems.map((item) => item.id);
    const allSelected = shopItemIds.every((id) => selected.includes(id));
    if (allSelected) setSelected((prev) => prev.filter((id) => !shopItemIds.includes(id)));
    else setSelected((prev) => [...new Set([...prev, ...shopItemIds])]);
  };

  const toggleSelectItem = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // === Hapus item yang dipilih
  const removeSelected = () => {
    setCart((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
    setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(cart.filter((item) => !selected.includes(item.id))));
      window.dispatchEvent(new Event('cartUpdated'));
    }, 0);
  };

  // === Update quantity
  const updateQuantity = (id: number, type: 'plus' | 'minus') => {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: type === 'plus' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // === Total Harga dari yang dipilih
  const total = cart.filter((item) => selected.includes(item.id)).reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log('🧾 Cart content:', cart);
  console.log('📦 Grouped cart:', groupedCart);

  // === SEMENTARA LOADING ===
  if (isLoading) {
    return (
      <section className="w-full min-h-[70vh] flex justify-center items-center">
        <p className="text-neutral-500 text-base animate-pulse">Loading your cart...</p>
      </section>
    );
  }

  // === CART KOSONG ===
  if (!isLoading && cart.length === 0) {
    return (
      <section className="w-full min-h-[70vh] flex flex-col justify-center items-center gap-6 text-center py-10">
        <Image src="/assets/images/icons/empty-cart.svg" alt="Empty Cart" width={120} height={120} unoptimized />
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800">Your Cart is Empty</h2>
        <p className="text-neutral-500 text-sm md:text-base max-w-md">Your cart is waiting. Add your favorite items and come back to checkout.</p>
        <Link href="/catalog">
          <Button className="mt-4 px-6 py-3 bg-black text-white hover:bg-primary hover:text-black">Start Shopping</Button>
        </Link>
      </section>
    );
  }

  // === CART ADA PRODUK
  return (
    <section className="max-w-[1200px] mx-auto py-10 px-4 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Cart</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* === LEFT === */}
        <div className="flex-1 border border-neutral-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} className="accent-neutral-950 w-4 h-4" />
              <span className="text-sm font-semibold text-neutral-800">Select All</span>
            </div>
            {selected.length > 0 && (
              <button onClick={removeSelected} className="text-red-500 text-sm font-semibold hover:underline">
                Remove Selected
              </button>
            )}
          </div>

          <Separator className="mb-4" />

          {groupedCart.map((group) => (
            <div key={group.shopId}>
              <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" checked={group.items.every((i) => selected.includes(i.id))} onChange={() => toggleSelectShop(group.shopId)} className="accent-neutral-950 w-4 h-4" />
                <span className="text-sm font-semibold text-neutral-800">{group.shopName}</span>
              </div>

              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-neutral-200 py-4">
                  <div className="flex items-center gap-3 w-full">
                    <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelectItem(item.id)} className="accent-neutral-950 w-4 h-4" />
                    <Image src={item.image || '/assets/images/no-image.png'} alt={item.title} width={80} height={80} className="rounded-lg border border-neutral-200 object-cover" unoptimized />
                    <div className="flex flex-col flex-1">
                      <p className="font-semibold text-sm md:text-base text-neutral-900">{item.title}</p>
                      <p className="text-sm text-neutral-500">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setCart((prev) => prev.filter((i) => i.id !== item.id))} className="p-2 hover:bg-neutral-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-neutral-600" />
                    </button>

                    <div className="flex items-center border border-neutral-300 rounded-lg px-2">
                      <button onClick={() => updateQuantity(item.id, 'minus')} className="p-1 text-lg">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-medium text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 'plus')} className="p-1 text-lg">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* === RIGHT: TOTAL === */}
        <div className="w-full md:w-1/3 border border-neutral-200 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Total Shopping</h3>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="text-xl font-bold text-neutral-950">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <Button className="w-full bg-black text-white hover:bg-primary hover:text-black disabled:opacity-50" disabled={selected.length === 0}>
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
