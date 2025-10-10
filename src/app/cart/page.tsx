'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartItem, ApiCartResponse } from '@/types/cart';

type ShopGroup = {
  shopId: number;
  shopName: string;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]); // berisi cartItemId yang dicentang
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: ApiCartResponse = await res.json();
      console.log('🛒 API Cart Response:', data);

      if (!res.ok || !data.success || !data.data?.items) {
        throw new Error('Gagal mengambil data cart');
      }

      const apiCart: CartItem[] = data.data.items.map((item) => ({
        cartItemId: item.id, // penting untuk update/delete
        productId: item.productId,
        title: item.product?.title ?? 'Unknown Product',
        price: item.priceSnapshot,
        quantity: item.qty,
        image: item.product?.images?.[0] || '/assets/images/no-image.png',
        shop: {
          id: item.product?.shop?.id ?? 0,
          name: item.product?.shop?.name ?? 'Unknown Shop',
          logo: '/assets/images/icons/store.svg',
        },
      }));

      setCart(apiCart);
    } catch (err) {
      console.error('❌ Error fetching cart:', err);
      setCart([]);
    } finally {
      setIsLoading(false);
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

  // === Group by Shop ===
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

  // === Checkbox Logic ===
  const isAllSelected = selected.length === cart.length && cart.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(cart.map((item) => item.cartItemId));
  };

  const toggleSelectShop = (shopId: number) => {
    const shopItems = groupedCart.find((g) => g.shopId === shopId)?.items ?? [];
    const shopItemIds = shopItems.map((item) => item.cartItemId);
    const allSelected = shopItemIds.every((id) => selected.includes(id));

    if (allSelected) {
      // Uncheck semua item di toko itu
      setSelected((prev) => prev.filter((id) => !shopItemIds.includes(id)));
    } else {
      // Check semua item toko itu
      setSelected((prev) => [...new Set([...prev, ...shopItemIds])]);
    }
  };

  const toggleSelectItem = (cartItemId: number) => {
    setSelected((prev) => (prev.includes(cartItemId) ? prev.filter((id) => id !== cartItemId) : [...prev, cartItemId]));
  };

  // === Hapus item yang dipilih (pakai API)
  const removeSelected = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Hapus item yang dicentang
      const itemsToDelete = cart.filter((item) => selected.includes(item.productId));

      await Promise.all(
        itemsToDelete.map((item) =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${item.cartItemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      // Reload cart setelah delete
      await loadCart();
      setSelected([]);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Gagal menghapus item:', error);
    }
  };

  // === Hapus satu item langsung via ikon trash
  const removeItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Konfirmasi (opsional)
      const confirmDelete = window.confirm('Hapus produk ini dari cart?');
      if (!confirmDelete) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Gagal menghapus produk');

      // Setelah sukses hapus → reload cart
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('❌ Gagal hapus produk:', error);
    }
  };

  // === Update quantity via API
  const updateQuantity = async (cartItemId: number, type: 'plus' | 'minus') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const item = cart.find((i) => i.cartItemId === cartItemId);
      if (!item) return;

      const newQuantity = type === 'plus' ? item.quantity + 1 : Math.max(1, item.quantity - 1);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qty: newQuantity }),
      });

      if (!response.ok) throw new Error('Gagal update quantity');

      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // === Total Harga dari yang dipilih
  const total = cart.filter((item) => selected.includes(item.cartItemId)).reduce((sum, item) => sum + item.price * item.quantity, 0);

  // === Checkout hanya item yang dipilih
  const handleProceedToCheckout = () => {
    if (selected.length === 0) return;

    const selectedItems = cart.filter((item) => selected.includes(item.cartItemId));
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));

    console.log('✅ selectedCartItems disimpan:', selectedItems);

    router.push('/checkout');
  };

  // === Loading state
  if (isLoading) {
    return (
      <section className="w-full min-h-[70vh] flex justify-center items-center">
        <p className="text-neutral-500 text-base animate-pulse">Loading your cart...</p>
      </section>
    );
  }

  // === Cart kosong
  if (!isLoading && cart.length === 0) {
    return (
      <section className="w-full min-h-[70vh] flex flex-col justify-center items-center gap-6 text-center py-10">
        <Image src="/assets/images/EmptyCart.png" alt="Empty Cart" width={120} height={120} unoptimized />
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800">Your Cart is Empty</h2>
        <p className="text-neutral-500 text-sm md:text-base">Your cart is waiting. Add your favorite items and come back to checkout.</p>
        <Link href="/product">
          <Button className="cursor-pointer mt-4 px-6 py-3 bg-black text-white hover:bg-primary hover:text-black">Start Shopping</Button>
        </Link>
      </section>
    );
  }

  // === CART ADA PRODUK
  return (
    <section className="max-w-[1200px] mx-auto py-10 px-4 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Cart</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT */}
        <div className="flex-1 border border-neutral-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between">
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
            <div key={group.shopId} className="my-4">
              <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" checked={group.items.every((i) => selected.includes(i.cartItemId))} onChange={() => toggleSelectShop(group.shopId)} className="accent-neutral-950 w-4 h-4" />
                <span className="text-sm font-semibold text-neutral-800">{group.shopName}</span>
              </div>

              {group.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between border-b border-neutral-200 py-4 transition-all duration-200 hover:bg-neutral-50">
                  <div className="flex items-center gap-3 w-full">
                    <input type="checkbox" checked={selected.includes(item.cartItemId)} onChange={() => toggleSelectItem(item.cartItemId)} className="accent-neutral-950 w-4 h-4" />
                    <div className="flex w-[80px] h-[80px] border border-neutral-300 rounded-md overflow-hidden">
                      <Image src={item.image || '/assets/images/no-image.png'} alt={item.title} width={80} height={80} className="rounded-lg border border-neutral-200 object-cover" unoptimized />
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="font-semibold text-sm md:text-base text-neutral-900">{item.title}</p>
                      <p className="text-sm text-neutral-500">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => removeItem(item.cartItemId)} className="p-2 hover:bg-neutral-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-neutral-600" />
                    </button>

                    <div className="flex items-center border border-neutral-300 rounded-lg px-2">
                      <button onClick={() => updateQuantity(item.cartItemId, 'minus')} className="p-1 text-lg">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-medium text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, 'plus')} className="p-1 text-lg">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* RIGHT: TOTAL */}
        <div className="w-full md:w-1/3 border border-neutral-200 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Total Shopping</h3>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="text-xl font-bold text-neutral-950">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <Button onClick={handleProceedToCheckout} className="cursor-pointer w-full bg-black text-white hover:bg-primary hover:text-black disabled:opacity-50" disabled={selected.length === 0}>
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
