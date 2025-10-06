'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterSchema } from '@/schemas/registerSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Register gagal');

      // ✅ Register sukses
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg('Terjadi kesalahan tidak diketahui');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-100">
      <div className="p-6 rounded-xl bg-white w-md shadow-sm max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-5">
          <Image src="/assets/images/logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-neutral-950 text-2xl font-bold">Shirt</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <p className="text-base mb-4 text-neutral-700">Just a few steps away from your next favorite purchase</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Input label="Name" type="text" {...register('name')} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Input label="Email" type="email" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <PasswordInput label="Password" {...register('password')} aria-invalid={!!errors.password} />
            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordInput label="Confirm Password" {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</p>}
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

          <Button type="submit" disabled={isLoading} className="h-12 w-full bg-neutral-950 hover:bg-primary rounded-xl font-semibold text-white cursor-pointer text-base">
            {isLoading ? 'Loading...' : 'Register'}
          </Button>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?{' '}
            <Link href="/login" className="underline font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
