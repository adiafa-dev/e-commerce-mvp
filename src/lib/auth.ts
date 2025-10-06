// lib/auth.ts
import { cookies } from 'next/headers';

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true, // ❗ tidak bisa diakses lewat JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}
