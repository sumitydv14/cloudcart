'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';

interface AuthGuardProps {
  children: React.ReactNode;
  allowRoles?: string[];
}

const AuthGuard = ({ children, allowRoles = [] }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (allowRoles.length > 0 && user && !allowRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [isAuthenticated, user, allowRoles, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-sm ring-1 ring-slate-200">Authenticating...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
