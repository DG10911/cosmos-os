import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Consistent detail-screen header: back chevron + title + optional subtitle
 * and trailing action. Gives every sub-page the same iOS-native top bar.
 */
export function PageHeader({
  title,
  sub,
  right,
  onBack,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const nav = useNavigate();
  return (
    <div className="mb-3 flex items-center gap-2 pt-1">
      <button
        onClick={() => (onBack ? onBack() : nav(-1))}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-text-primary active:scale-90"
        aria-label="Back"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="serif truncate text-xl leading-tight text-text-primary">
          {title}
        </h1>
        {sub && <p className="truncate text-[11px] text-text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
