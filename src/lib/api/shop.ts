// src/lib/api/shop.ts
'use client';
const shopLogoCache: Record<number, string> = {};

/**
 * Ambil logo toko dari API berdasarkan shopId.
 * Cache hasil supaya tidak fetch berulang.
 */
export async function getShopLogo(shopId: number): Promise<string> {
  if (shopLogoCache[shopId]) return shopLogoCache[shopId];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shops/${shopId}`);
    if (!res.ok) throw new Error('Failed to fetch shop logo');

    const data = await res.json();
    console.log('🧩 Shop data:', data);
    const logo = data.data?.logo || '/assets/images/icons/store.svg';
    shopLogoCache[shopId] = logo; // simpan di cache
    return logo;
  } catch (err) {
    console.error('❌ Error fetching shop logo:', err);
    return '/assets/images/icons/store.svg';
  }
}
