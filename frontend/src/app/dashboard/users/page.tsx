'use client';

import AuthGuard from '@/components/layout/AuthGuard';

export default function DashboardUsersPage() {
  return (
    <AuthGuard allowRoles={['admin']}>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-semibold text-slate-900">User management</h1>
            <p className="mt-2 text-slate-600">Manage customers, sellers, and admin roles from the CloudCart dashboard.</p>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
