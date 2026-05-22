'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import cn from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'secondary' && 'bg-slate-100 text-slate-900 hover:bg-slate-200',
          variant === 'ghost' && 'bg-transparent text-slate-700 hover:bg-slate-100',
          size === 'sm' && 'h-10 px-4 text-sm',
          size === 'md' && 'h-12 px-5 text-base',
          size === 'lg' && 'h-14 px-6 text-lg',
          className,
        )}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
