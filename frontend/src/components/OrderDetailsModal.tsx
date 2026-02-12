import type { Order } from "../types.ts";

function statusLabel(s: number) {
  if (s === 0) return "Pending";
  if (s === 1) return "Processing";
  return "Finished";
}

export function OrderDetailsModal({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-lg rounded-2xl border bg-white p-5 shadow-lg animate-[modalIn_.15s_ease-out]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Detalhes do pedido</h2>
            <p className="text-sm text-slate-500">Visualização rápida</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {!order ? (
          <p className="mt-6 text-slate-600">Carregando...</p>
        ) : (
          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-500">ID</p>
              <p className="font-mono break-all">{order.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Cliente</p>
                <p className="font-semibold">{order.customer}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Produto</p>
                <p className="font-semibold">{order.product}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Valor</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(order.amount)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Status</p>
                <p className="font-semibold">{statusLabel(order.status)}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-500">Criado em</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
