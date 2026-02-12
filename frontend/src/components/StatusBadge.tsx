import type { OrderStatus } from "../lib/types";
import { statusLabel } from "../lib/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold";

  const dot = "h-2 w-2 rounded-full";

  if (status === 0) {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-800`}>
        <span className={`${dot} bg-yellow-500`} />
        {statusLabel(status)}
      </span>
    );
  }

  if (status === 1) {
    return (
      <span className={`${base} bg-blue-100 text-blue-800`}>
        <span className={`${dot} bg-blue-500 animate-pulse`} />
        {statusLabel(status)}
      </span>
    );
  }

  return (
    <span className={`${base} bg-green-100 text-green-800`}>
      <span className={`${dot} bg-green-500`} />
      {statusLabel(status)}
    </span>
  );
}
