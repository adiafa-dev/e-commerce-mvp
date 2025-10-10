'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { ApiOrderResponse, Order } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'complete' | 'cancel' | 'review' | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { user } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const logoCacheRef = useRef<Map<number, string>>(new Map());
  // ✅ Cache logo biar gak fetch berulang

  // ✅ Ambil logo toko dari /products/:id (cache biar efisien)
  // ✅ Ambil logo toko dari /products/:id (pakai cache)
  const fetchShopLogo = useCallback(
    async (productId: number, shopId: number): Promise<string> => {
      if (logoCacheRef.current.has(shopId)) return logoCacheRef.current.get(shopId)!;

      try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        const data = await res.json();

        const logo = data?.data?.shop?.logo;
        const finalLogo = logo && logo.trim() !== '' ? logo : '/assets/images/icons/store.svg';
        logoCacheRef.current.set(shopId, finalLogo);
        return finalLogo;
      } catch (err) {
        console.warn('⚠️ Gagal ambil logo toko dari produk', productId, err);
        return '/assets/images/icons/store.svg';
      }
    },
    [API_URL]
  );

  // ✅ Fetch Orders dari API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const res = await fetch(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: ApiOrderResponse = await res.json();
      console.log('📦 Orders data:', data);

      if (!data.success || !Array.isArray(data.data?.orders)) {
        throw new Error('Invalid response format');
      }

      // 🔁 Map orders + ambil logo toko via /products/:id
      const mappedOrders: Order[] = await Promise.all(
        data.data.orders.map(async (order) => {
          const firstItem = order.items[0];
          const productId = firstItem?.productId ?? 0;
          const shopId = firstItem?.shopId ?? 0;

          const shopLogo = await fetchShopLogo(productId, shopId);

          return {
            id: order.id,
            invoice: order.code,
            paymentStatus: order.paymentStatus,
            shop: {
              id: shopId,
              name: firstItem?.shop?.name ?? 'Unknown Shop',
              logo: shopLogo,
            },
            total: order.totalAmount,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              id: item.id,
              title: item.product?.title ?? 'Unknown Product',
              image: item.product?.images?.[0] ?? '/assets/images/no-image.png',
              price: item.priceSnapshot,
              quantity: item.qty,
              status: item.status,
            })),
            // ✅ "PAID" dianggap sebagai "completed"
            status: order.paymentStatus === 'PAID' ? 'completed' : order.paymentStatus.toLowerCase(),
          };
        })
      );

      setOrders(mappedOrders);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [API_URL, fetchShopLogo]);

  // ✅ Load saat pertama kali
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // === COMPLETE ORDER ===
  const handleComplete = async (itemId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/items/${itemId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to complete order');
      toast.success('Order marked as completed!');
      setModalType(null);
      fetchOrders();
    } catch {
      toast.error('Error completing order');
    }
  };

  // === CANCEL ORDER ===
  const handleCancel = async (itemId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/items/${itemId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      toast.success('Order cancelled successfully!');
      setModalType(null);
      fetchOrders();
    } catch {
      toast.error('Error cancelling order');
    }
  };

  // === FILTER TAB ===
  const filteredOrders = activeTab === 'all' ? orders : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());

  // === LOADING STATE ===
  if (loading) return <div className="flex justify-center items-center min-h-[80vh] text-neutral-600">Loading orders...</div>;

  // === EMPTY STATE ===
  if (orders.length === 0)
    return (
      <section className="flex flex-col md:flex-row min-h-[80vh]">
        <aside className="w-full md:w-1/4 border-r border-neutral-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-6">
              <Image src={user?.avatarUrl || '/assets/images/icons/user.svg'} alt={user?.name || 'User'} width={40} height={40} className="rounded-full border border-neutral-200 object-cover" unoptimized />
              <div>
                <h3 className="font-semibold text-neutral-900">{user?.name || 'Guest User'}</h3>
                {user?.email && <p className="text-xs text-neutral-500">{user.email}</p>}
              </div>
            </div>
            <Separator className="my-2" />
            <Link href="/orders" className="text-sm font-semibold text-neutral-950">
              🧾 Order List
            </Link>
            <Separator className="my-2" />
            <Link href="/reviews" className="text-sm text-neutral-700 hover:text-neutral-900">
              ⭐ Review
            </Link>
            <Separator className="my-2" />
            <button className="text-sm text-red-600 hover:text-red-700 font-semibold mt-4">Logout</button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6">
          <Image src="/assets/images/icons/empty-doc.svg" alt="No Orders" width={120} height={120} unoptimized />
          <h2 className="font-bold text-xl text-neutral-900">No Orders Yet</h2>
          <p className="text-neutral-500 text-sm">Once you place an order, you can see all your purchases right here.</p>
          <Link href="/catalog">
            <Button className="bg-black text-white hover:bg-primary hover:text-black">Start Shopping</Button>
          </Link>
        </div>
      </section>
    );

  // === MAIN CONTENT ===
  return (
    <section className="flex max-w-[1200px] mx-auto p-4 md:p-0 w-full">
      {/* Sidebar */}
      <aside className="md:flex flex-col w-1/5 border border-neutral-300 rounded-2xl mt-8 p-4">
        <div className="">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-6">
              <Image src={user?.avatarUrl || '/assets/images/icons/user.svg'} alt={user?.name || 'User'} width={40} height={40} className="rounded-full border border-neutral-200 object-cover" unoptimized />
              <div>
                <h3 className="font-semibold text-neutral-900">{user?.name || 'Guest User'}</h3>
                {user?.email && <p className="text-xs text-neutral-500">{user.email}</p>}
              </div>
            </div>
            <Separator className="my-1" />
            <Link href="/orders" className="text-sm font-semibold text-neutral-950">
              🧾 Order List
            </Link>
            <Separator className="my-1" />
            <Link href="/reviews" className="text-sm text-neutral-700 hover:text-neutral-900">
              ⭐ Review
            </Link>
            <Separator className="my-1" />
            <button className="text-sm text-red-600 hover:text-red-700 font-semibold mt-4">Logout</button>
          </div>
        </div>
      </aside>

      {/* Orders List */}
      <div className="w-full md:w-4/5 flex-1 p-4 pr-0">
        <div>
          <h2 className="text-2xl font-bold mb-6">Order List</h2>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-2 mb-2">
              {['all', 'processing', 'delivered', 'completed', 'cancelled'].map((status) => (
                <TabsTrigger key={status} value={status} className="capitalize data-[state=active]:bg-black data-[state=active]:text-white">
                  {status === 'all' ? 'All Orders' : status}
                </TabsTrigger>
              ))}
            </TabsList>

            <Separator />

            <TabsContent value={activeTab}>
              <div className="flex flex-col gap-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-neutral-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Image src={order.shop.logo || '/assets/images/icons/store.svg'} alt={order.shop.name} width={24} height={24} unoptimized className="object-cover rounded-full" />
                        <p className="font-semibold text-sm">{order.shop.name}</p>
                        <span className="text-xs text-neutral-500">• {order.invoice}</span>
                        <span className="text-xs text-neutral-500">• {new Date(order.createdAt).toLocaleString('id-ID')}</span>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-md capitalize
                        ${
                          order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'delivered'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <Separator className="mb-4" />

                    {/* Items */}
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 mb-4">
                        <div className="flex w-[80px] h-[80px] border border-neutral-300 rounded-md overflow-hidden">
                          <Image src={item.image} alt={item.title} width={80} height={80} className="rounded-lg border object-cover" unoptimized />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-neutral-500">
                            {item.quantity} x Rp{item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-normal text-sm">
                        Total Payment <br />
                        <span className="text-base text-neutral-900 font-semibold">Rp{order.total.toLocaleString('id-ID')}</span>
                      </p>

                      {order.status === 'processing' && (
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => {
                            setSelectedItemId(order.items[0].id);
                            setModalType('cancel');
                          }}
                        >
                          Cancel Order
                        </Button>
                      )}

                      {order.status === 'delivered' && (
                        <Button
                          className="bg-black text-white hover:bg-primary hover:text-black"
                          onClick={() => {
                            setSelectedItemId(order.items[0].id);
                            setModalType('complete');
                          }}
                        >
                          Complete Order
                        </Button>
                      )}

                      {order.status === 'completed' && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedItemId(order.items[0].id);
                            setModalType('review');
                          }}
                        >
                          Give Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* === MODAL === */}
      <Dialog open={!!modalType} onOpenChange={() => setModalType(null)}>
        <DialogContent className="sm:max-w-md">
          {modalType === 'cancel' && (
            <>
              <DialogHeader>
                <DialogTitle>Cancel Order</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-neutral-600 mb-6">Cancel this order? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setModalType(null)}>
                  Keep Order
                </Button>
                <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleCancel(selectedItemId!)}>
                  Cancel Order
                </Button>
              </div>
            </>
          )}

          {modalType === 'complete' && (
            <>
              <DialogHeader>
                <DialogTitle>Complete Order</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-neutral-600 mb-6">Mark this order as completed? Once confirmed, this cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setModalType(null)}>
                  Back
                </Button>
                <Button className="bg-black text-white hover:bg-primary hover:text-black" onClick={() => handleComplete(selectedItemId!)}>
                  Complete Order
                </Button>
              </div>
            </>
          )}

          {modalType === 'review' && (
            <>
              <DialogHeader>
                <DialogTitle>Give Review</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <textarea placeholder="Write your review here..." className="w-full border border-neutral-300 rounded-lg p-3 text-sm min-h-[100px]" />
              <Button className="w-full mt-4 bg-black text-white hover:bg-primary hover:text-black">Submit</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
