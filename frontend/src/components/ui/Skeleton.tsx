const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />
);

export default Skeleton;
