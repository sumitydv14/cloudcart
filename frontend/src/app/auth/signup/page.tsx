'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/forms/SignupForm';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { signup } = useAuth();

  const handleSubmit = async (values: { name: string; email: string; password: string; confirmPassword: string, role: string }) => {
    setFormError(null);
    try {
      await signup(values.name, values.email, values.password, values.role);
      router.push('/');
    } catch (error: any) {
      setFormError(error?.data?.message ?? 'Unable to create account.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <SignupForm onSubmit={handleSubmit} error={formError} />
        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
