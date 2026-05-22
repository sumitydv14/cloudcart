'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/forms/LoginForm';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.push('/');
    } catch (error: any) {
      setFormError(error?.data?.message ?? 'Unable to sign in.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <LoginForm onSubmit={handleSubmit} error={formError} />
        <p className="mt-4 text-sm text-slate-600">
          Don&apos;t have an account? <Link href="/auth/signup" className="font-semibold text-blue-600 hover:underline">Create one</Link>
        </p>
      </div>
    </main>
  );
}
