'use client';

import AuthGuard from '@/components/layout/AuthGuard';

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-semibold text-slate-900">Checkout</h1>
            <p className="mt-2 text-slate-600">Complete your purchase with shipping and payment details.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-600">Checkout form and review will be implemented here.</p>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
