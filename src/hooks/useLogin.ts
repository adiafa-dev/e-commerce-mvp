'use client';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

type LoginData = {
  email: string;
  password: string;
};

export function useLogin() {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: async (formData: LoginData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // kalau respons bukan JSON valid (misalnya HTML error)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server Error: ${text.slice(0, 100)}`);
      }

      if (!res.ok) throw new Error(data.message || 'Login gagal');

      // pastikan data user & token
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      if (!token || !user) throw new Error('Data login tidak lengkap');

      // simpan ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // update state global (langsung aktif tanpa reload)
      setUser(user);

      return data;
    },
  });
}
