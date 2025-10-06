'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/schemas/authSchema';
import Image from 'next/image';
import Link from 'next/link';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Login gagal');

      // ✅ Login sukses — cookie otomatis diset oleh server
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Terjadi kesalahan tidak diketahui');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-100">
      <div className="p-6 rounded-xl drop-shadow-sm bg-white w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-5">
          <Image src="/assets/images/logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-neutral-950 text-2xl font-bold">Shirt</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-base mb-4 text-neutral-700">Access your account and start shopping in seconds</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-3">
            {/* <input type="email" placeholder="Email" {...register('email')} className="w-full h-14 rounded-xl border border-neutral-300 px-3" /> */}
            <Input label="Email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm mt-2.5">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-3">
            {/* <input type="password" placeholder="Password" {...register('password')} className="w-full h-14 rounded-xl border border-neutral-300 px-3" /> */}
            <PasswordInput {...register('password')} />
            {errors.password && <p className="text-red-500 text-sm mt-2.5">{errors.password.message}</p>}
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <Button disabled={isLoading} className="h-12 w-full bg-neutral-950 hover:bg-primary rounded-xl font-semibold text-white cursor-pointer text-base">
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
          <p className="mt-4 text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
