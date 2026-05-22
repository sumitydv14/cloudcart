import { notFound } from 'next/navigation';

const productData = {
  'cloudcart-sneakers': {
    name: 'CloudCart Sneakers',
    price: 89.99,
    description: 'A premium pair of sneakers engineered for comfort and everyday style.',
  },
  'cloudcart-hoodie': {
    name: 'CloudCart Hoodie',
    price: 59.99,
    description: 'A cozy hoodie with modern fit and performance fabrics.',
  },
  'cloudcart-backpack': {
    name: 'CloudCart Backpack',
    price: 45.0,
    description: 'A versatile backpack with smart storage and durable materials.',
  },
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async  function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = productData[slug as keyof typeof productData];

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-4xl font-semibold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-xl text-blue-600">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-slate-600">{product.description}</p>
        </section>
      </div>
    </main>
  );
}
