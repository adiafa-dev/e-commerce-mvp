'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarUrl: string;
};

export function useRegister() {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: async (formData: RegisterData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      console.log('📨 RAW RESPONSE:', text); // ⬅️ tambahkan ini
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server Error: ${text.slice(0, 100)}`);
      }

      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

      const user = data.data;
      if (!user) throw new Error('Data registrasi tidak lengkap');

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      return data;
    },
  });
}
