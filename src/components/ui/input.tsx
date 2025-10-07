import * as React from 'react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type InputProps = React.ComponentProps<'input'> & {
  label?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, label, ...props }, ref) => {
  const [hasValue, setHasValue] = React.useState(Boolean(props.defaultValue || props.value));
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      {label && (
        <label className={cn('absolute left-3 text-sm text-muted-foreground pointer-events-none transition-all duration-200 ease-out', hasValue || focused ? 'top-2 text-xs' : 'top-2.5 text-sm text-muted-foreground')}>{label}</label>
      )}

      <input
        ref={ref}
        type={type}
        data-slot="input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-transparent px-3 pt-5 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          props.onChange?.(e);
        }}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
