// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { setAuthToken } from '@/lib/auth';
import { loginSchema } from '@/schemas/authSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || 'Login gagal' }, { status: res.status });
    }

    const data = await res.json();

    if (!data.token) {
      return NextResponse.json({ message: 'Token tidak ditemukan' }, { status: 500 });
    }

    await setAuthToken(data.token);

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
