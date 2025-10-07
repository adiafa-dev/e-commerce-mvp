'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/schemas/authSchema';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/useLogin';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data, {
      onSuccess: () => router.push('/'),
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-100">
      <div className="p-6 rounded-xl bg-white w-md shadow-sm max-w-md">
        <div className="flex items-center gap-2.5 mb-5">
          <Link href="/" className="flex gap-2.5">
            <Logo sizeWidth={32} />
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-base mb-4 text-neutral-700">Access your account and start shopping in seconds</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <PasswordInput label="Password" {...register('password')} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          {loginMutation.error && <p className="text-red-500 text-center">{(loginMutation.error as Error).message}</p>}

          <Button type="submit" disabled={loginMutation.isPending} className="h-12 w-full bg-neutral-950 hover:bg-primary rounded-xl font-semibold text-white transition duration-500 cursor-pointer">
            {loginMutation.isPending ? 'Loading...' : 'Login'}
          </Button>

          <p className="text-sm text-center mt-4">
            Belum punya akun?{' '}
            <Link href="/register" className="underline font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
