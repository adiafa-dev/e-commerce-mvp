'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type PasswordInputProps = React.ComponentProps<'input'> & {
  label?: string;
};

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      {/* Label kecil (floating) */}
      {/* <label className={cn('absolute left-3 text-sm text-muted-foreground transition-all', hasValue ? 'top-2 text-xs' : 'top-2.5 text-sm pointer-events-none text-muted-foreground')}>{label}</label> */}

      {/* Input utama */}
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        className={cn(
          '', // ruang buat label & icon
          className
        )}
        {...props}
      />

      {/* Tombol mata */}
      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
