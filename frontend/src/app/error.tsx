'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="max-w-xl rounded-3xl bg-white p-10 shadow-lg ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-4 text-slate-600">An unexpected error occurred while loading this page.</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
