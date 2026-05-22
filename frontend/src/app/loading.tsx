export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
        <div className="h-4 w-4 animate-pulse rounded-full bg-blue-600" />
        <span>Loading CloudCart...</span>
      </div>
    </div>
  );
}
