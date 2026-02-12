export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-3 rounded-xl border p-3"
        >
          {Array.from({ length: 6 }).map((__, j) => (
            <div
              key={j}
              className="h-5 rounded bg-slate-200/70 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
