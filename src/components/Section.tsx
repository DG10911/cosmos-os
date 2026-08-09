import type { ReactNode } from "react";

/**
 * A titled content section with a clear, consistent identity:
 * icon badge + title + optional subtitle + optional trailing action.
 * Enforces generous top spacing so sections read as distinct zones.
 */
export function Section({
  icon,
  tint = "#FFE7D6",
  fg = "#FF6B2C",
  title,
  sub,
  action,
  onAction,
  children,
  first,
}: {
  icon: ReactNode;
  tint?: string;
  fg?: string;
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section className={first ? "mt-5" : "mt-7"}>
      <div className="mb-3 flex items-center gap-2.5 px-0.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: tint, color: fg }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="serif text-[17px] leading-tight text-text-primary">
            {title}
          </h2>
          {sub && <p className="text-[11px] leading-tight text-text-muted">{sub}</p>}
        </div>
        {action && (
          <button
            onClick={onAction}
            className="shrink-0 rounded-full bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold active:scale-95"
          >
            {action} →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
