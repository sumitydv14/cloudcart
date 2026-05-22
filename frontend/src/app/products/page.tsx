import Link from 'next/link';

const products = [
  { id: '1', name: 'CloudCart Sneakers', price: 89.99, slug: 'cloudcart-sneakers' },
  { id: '2', name: 'CloudCart Hoodie', price: 59.99, slug: 'cloudcart-hoodie' },
  { id: '3', name: 'CloudCart Backpack', price: 45.0, slug: 'cloudcart-backpack' },
];

export default function ProductListingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="text-slate-600">Browse the latest CloudCart catalog with quick search and filters.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.slug}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="space-y-4">
                <div className="h-48 rounded-3xl bg-slate-100" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                  <p className="mt-2 text-slate-600">Starting at ${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
