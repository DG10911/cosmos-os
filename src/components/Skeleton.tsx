/** Shimmer skeleton primitives for premium loading states. */

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton ${className}`} style={style} />;
}

/** A skeleton that mimics an astrologer card, used while the Consult list "loads". */
export function AstrologerCardSkeleton() {
  return (
    <div className="cosmic-card p-3.5">
      <div className="flex gap-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-btn" />
        <Skeleton className="h-9 flex-1 rounded-btn" />
      </div>
    </div>
  );
}

/** Generic card skeleton block. */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="cosmic-card space-y-2 p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3.5"
          style={{ width: `${90 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
