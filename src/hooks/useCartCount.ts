'use client';

import { useState, useEffect } from 'react';
import { ApiCartResponse } from '@/types/cart';

export function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: ApiCartResponse = await res.json();
      if (!res.ok || !data.success || !data.data?.items) {
        setCartCount(0);
        return;
      }

      // ✅ Hitung total qty dari data backend dengan type safety
      const total = data.data.items.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(total);
    } catch (err) {
      console.error('❌ Error loading cart count:', err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount(); // Load saat pertama render

    const handleCartUpdate = () => {
      console.log('🔁 cartUpdated diterima, refresh count');
      loadCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return cartCount;
}
