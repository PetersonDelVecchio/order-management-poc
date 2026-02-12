import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
};

function typeClasses(type: ToastType) {
  switch (type) {
    case "success":
      return "border-green-200 bg-green-50 text-green-900";
    case "error":
      return "border-red-200 bg-red-50 text-red-900";
    case "info":
    default:
      return "border-slate-200 bg-white text-slate-900";
  }
}

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: (id: string) => void;
}) {
  useEffect(() => {
    const duration = toast.durationMs ?? 3500;
    const t = setTimeout(() => onClose(toast.id), duration);
    return () => clearTimeout(t);
  }, [toast.id, toast.durationMs, onClose]);

  return (
    <div
      className={[
        "w-85 rounded-xl border shadow-sm p-4",
        "animate-[toastIn_.18s_ease-out]",
        typeClasses(toast.type),
      ].join(" ")}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold leading-5">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm leading-5 opacity-90 wrap-break-word">
              {toast.message}
            </p>
          )}
        </div>

        <button
          onClick={() => onClose(toast.id)}
          className="rounded-md px-2 py-1 text-sm hover:opacity-80"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastHost({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
