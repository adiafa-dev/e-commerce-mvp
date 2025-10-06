// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { registerSchema } from '@/schemas/registerSchema';
import { setAuthToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Data tidak valid' }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ message: errorData.message || 'Register gagal' }, { status: res.status });
    }

    const data = await res.json();

    if (data.token) {
      await setAuthToken(data.token);
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
