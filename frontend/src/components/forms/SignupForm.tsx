'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/features/auth/schemas';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { infer as zodInfer } from 'zod';

type SignupFormValues = zodInfer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void | Promise<void>;
  error?: string | null;
}

const SignupForm = ({ onSubmit, error }: SignupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Create your CloudCart account</h1>
        <p className="text-sm text-slate-600">Register to start shopping and manage orders securely.</p>
      </div>
      <Input label="Full name" type="text" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      <Input label="Confirm password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" loading={isSubmitting} className="w-full">
        Create account
      </Button>
    </form>
  );
};

export default SignupForm;
