import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600">CloudCart</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">The next-generation enterprise commerce storefront.</h1>
              <p className="max-w-xl text-slate-600">Build fast, secure, and scalable shopping experiences with CloudCart&apos;s modern frontend architecture.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Browse products
                </Link>
                <Link href="/auth/login" className="inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-100 p-8 text-slate-700 shadow-inner">Product discovery, checkout flow, and admin dashboards ready for enterprise.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
