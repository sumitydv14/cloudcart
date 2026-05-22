'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/features/auth/schemas';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { infer as zodInfer } from 'zod';

type LoginFormValues = zodInfer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  error?: string | null;
}

const LoginForm = ({ onSubmit, error }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Sign in to CloudCart</h1>
        <p className="text-sm text-slate-600">Enter your credentials to access your account and manage orders.</p>
      </div>
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" loading={isSubmitting} className="w-full">
        Continue
      </Button>
    </form>
  );
};

export default LoginForm;
