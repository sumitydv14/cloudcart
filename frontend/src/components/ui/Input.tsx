'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import cn from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-900">
      <span>{label}</span>
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
          error ? 'border-red-500 focus:ring-red-200' : '',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';
export default Input;
