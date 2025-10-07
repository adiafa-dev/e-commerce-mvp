'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterSchema } from '@/schemas/registerSchema';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/hooks/useRegister';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data, {
      onSuccess: () => router.push('/'),
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-100">
      <div className="p-6 rounded-xl bg-white w-md shadow-sm max-w-md">
        <div className="flex items-center gap-2.5 mb-5">
          <Logo sizeWidth={32} />
        </div>

        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <p className="text-base mb-4 text-neutral-700">Just a few steps away from your next favorite purchase</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input label="Email" type="email" {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <PasswordInput label="Password" {...register('password')} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <PasswordInput label="Confirm Password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

          <div className="hidden">
            <Input label="avatarUrl" {...register('avatarUrl')} value={'https://cdn-icons-png.flaticon.com/512/149/149071.png'} />
          </div>
          {registerMutation.error && <p className="text-red-500 text-center">{(registerMutation.error as Error).message}</p>}

          <Button type="submit" disabled={registerMutation.isPending} className="h-12 w-full bg-neutral-950 hover:bg-primary rounded-xl font-semibold text-white transition duration-500 cursor-pointer">
            {registerMutation.isPending ? 'Loading...' : 'Register'}
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
