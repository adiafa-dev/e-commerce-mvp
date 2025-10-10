'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { checkoutSchema } from '@/schemas/checkoutSchema';
import { CartItem } from '@/types/cart';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<number>(0);
  const [payment, setPayment] = useState<string>('bni');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    city: '',
    postal: '',
    detail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const selected = localStorage.getItem('selectedCartItems');
    if (selected) {
      const parsed: CartItem[] = JSON.parse(selected);
      console.log('✅ Loaded selected items:', parsed);
      setCart(parsed);
    } else {
      console.log('⚠️ No selected items found');
    }
  }, []);

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const total = totalPrice + shipping;

  // ✅ Validasi dengan Zod sebelum submit
  const handleCheckout = async () => {
    try {
      const result = checkoutSchema.safeParse({
        name: address.name,
        phone: address.phone,
        city: address.city,
        postal: address.postal,
        detail: address.detail,
        shipping,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must log in first!');
        return;
      }

      // ✅ Gunakan cartItemId untuk checkout
      const payload = {
        address: {
          name: address.name,
          phone: address.phone,
          city: address.city,
          postalCode: address.postal,
          address: address.detail,
        },
        shippingMethod: shipping === 10000 ? 'JNE REG' : shipping === 20000 ? 'JNE EXPRESS' : 'FREE SHIPPING',
        selectedItemIds: cart.map((item) => item.cartItemId), // ✅ gunakan cartItemId dari backend, bukan productId
      };

      console.log('🚀 Checkout payload:', payload);

      const res = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('✅ Checkout response:', data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Checkout failed');
      }

      localStorage.removeItem('selectedCartItems');
      window.dispatchEvent(new Event('cartUpdated'));
      router.push('/checkout/success');
    } catch (err) {
      console.error('❌ Checkout error:', err);
      router.push('/checkout/failed');
    }
  };

  // 🧹 Group by shop
  const groupedCart = useMemo(() => {
    const groups: Record<number, CartItem[]> = {};
    for (const item of cart) {
      if (!groups[item.shop.id]) groups[item.shop.id] = [];
      groups[item.shop.id].push(item);
    }
    return Object.entries(groups).map(([shopId, items]) => ({
      shopId: Number(shopId),
      shopName: items[0].shop.name,
      shopLogo: items[0].shop.logo || '/assets/images/icons/store.svg',
      items,
    }));
  }, [cart]);

  return (
    <section className="max-w-[1200px] mx-auto py-10 px-4 md:px-0 flex flex-col md:flex-row gap-10">
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold mb-2">Checkout</h2>

        {/* === Shipping Address === */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>

            {(['name', 'phone', 'city', 'postal', 'detail'] as const).map((field) => (
              <div key={field}>
                <Input label={field === 'detail' ? 'Address' : field.charAt(0).toUpperCase() + field.slice(1)} value={address[field]} onChange={(e) => setAddress({ ...address, [field]: e.target.value })} />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            <Label htmlFor="shipping">Shipping Method</Label>
            <select id="shipping" className="mt-2 w-full border border-neutral-300 rounded-md p-2" value={shipping} onChange={(e) => setShipping(Number(e.target.value))}>
              <option value={0}>Select Shipping</option>
              <option value={10000}>JNE REG - Rp10.000</option>
              <option value={20000}>JNE Express - Rp20.000</option>
              <option value={0}>Free Shipping</option>
            </select>

            {errors.shipping && <p className="text-red-500 text-sm mt-1">{errors.shipping}</p>}
          </CardContent>
        </Card>

        {/* === Product List === */}
        {groupedCart.map((shop) => (
          <Card key={shop.shopId}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Image src={shop.shopLogo} alt={shop.shopName} width={20} height={20} unoptimized />
                <h4 className="font-semibold text-base">{shop.shopName}</h4>
              </div>

              {shop.items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-center border-b border-neutral-200 py-3">
                  <div className="flex items-center gap-4">
                    <div className="flex w-[80px] h-[80px] border border-neutral-300 rounded-md overflow-hidden">
                      <Image src={item.image || '/assets/images/no-image.png'} alt={item.title} width={80} height={80} className="rounded-lg border object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* === RIGHT SIDE === */}
      <div className="w-full md:w-1/3">
        <Card className="sticky top-5">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <RadioGroup value={payment} onValueChange={setPayment}>
              {['bni', 'bri', 'bca', 'mandiri'].map((bank) => (
                <Label key={bank} htmlFor={bank} className="flex items-center justify-between border border-neutral-200 rounded-md p-3 hover:bg-neutral-50 cursor-pointer mb-2">
                  <div className="flex items-center gap-3">
                    <Image src={`/assets/images/${bank}.png`} alt={bank} width={24} height={24} unoptimized />
                    <span className="capitalize">{bank} Virtual Account</span>
                  </div>
                  <RadioGroupItem value={bank} id={bank} />
                </Label>
              ))}
            </RadioGroup>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-lg font-semibold mb-2">Payment Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Total Price of Goods</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping cost</span>
                <span>Rp {shipping.toLocaleString('id-ID')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base mt-2">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full bg-black text-white hover:bg-primary hover:text-black">
              Pay Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
