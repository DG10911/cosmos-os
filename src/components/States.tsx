import type { ReactNode } from "react";

/** Cosmic loading spinner — orbiting dot around a glowing core. */
export function CosmicLoader({ label, size = 40 }: { label?: string; size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <span className="relative" style={{ width: size, height: size }}>
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%,#FFC53D,#FF6B2C)",
            boxShadow: "0 0 20px rgba(255,154,31,0.6)",
            animation: "flame-flicker 1.6s ease-in-out infinite",
          }}
        />
        <span
          className="absolute rounded-full bg-cosmic"
          style={{
            width: size * 0.18,
            height: size * 0.18,
            top: -2,
            left: "50%",
            transformOrigin: `0 ${size / 2 + 2}px`,
            boxShadow: "0 0 8px rgba(124,58,237,0.9)",
            animation: "state-orbit 1.1s linear infinite",
          }}
        />
      </span>
      {label && <p className="text-xs text-text-muted">{label}</p>}
      <style>{`@keyframes state-orbit{from{transform:translateX(-50%) rotate(0)}to{transform:translateX(-50%) rotate(360deg)}}`}</style>
    </div>
  );
}

/** Consistent empty state — glyph + message + optional action. */
export function EmptyState({
  emoji = "✦",
  title,
  sub,
  action,
  onAction,
}: {
  emoji?: string;
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <span className="text-4xl">{emoji}</span>
      <p className="serif text-lg text-text-primary">{title}</p>
      {sub && <p className="max-w-[260px] text-sm text-text-muted">{sub}</p>}
      {action && (
        <button
          onClick={onAction}
          className="btn-gold mt-2 rounded-full px-5 text-sm"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/** Inline error state with retry. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
      <span className="text-3xl">🌫️</span>
      <p className="text-sm text-text-primary">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-1 text-sm font-bold text-gold">
          Try again
        </button>
      )}
    </div>
  );
}

/** Wrapper that renders loading/error/empty/content in the standard way. */
export function AsyncView({
  loading,
  error,
  empty,
  loadingLabel,
  emptyNode,
  onRetry,
  children,
}: {
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  loadingLabel?: string;
  emptyNode?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
}) {
  if (loading) return <CosmicLoader label={loadingLabel} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (empty && emptyNode) return <>{emptyNode}</>;
  return <>{children}</>;
}
