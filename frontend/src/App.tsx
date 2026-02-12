import { useEffect, useMemo, useState } from "react";
import type { Order } from "./types";
import { ToastHost, type ToastItem } from "./components/Toast";
import { TableSkeleton } from "./components/TableSkeleton";
import { OrderDetailsModal } from "./components/OrderDetailsModal";

const API_BASE = "http://localhost:5108";

function statusBadge(status: number) {
  if (status === 0) return "bg-yellow-100 text-yellow-900 border-yellow-200";
  if (status === 1) return "bg-blue-100 text-blue-900 border-blue-200";
  return "bg-green-100 text-green-900 border-green-200";
}

function statusLabel(status: number) {
  if (status === 0) return "Pending";
  if (status === 1) return "Processing";
  return "Finished";
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const total = useMemo(() => orders.length, [orders]);

  function pushToast(t: Omit<ToastItem, "id">) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...t }]);
  }

  function closeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function loadOrders() {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      if (!res.ok) throw new Error(`GET /orders falhou: ${res.status}`);
      const data = (await res.json()) as Order[];
      setOrders(data);
    } catch (e: any) {
      pushToast({
        type: "error",
        title: "Erro ao carregar pedidos",
        message: e?.message ?? "Falha desconhecida",
      });
    } finally {
      setLoading(false);
    }
  }

  async function createOrder() {
    const parsedAmount = Number(amount);

    if (!customer.trim() || !product.trim() || !amount.trim() || Number.isNaN(parsedAmount)) {
      pushToast({
        type: "error",
        title: "Campos inválidos",
        message: "Preencha Cliente, Produto e Valor (numérico).",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customer.trim(),
          product: product.trim(),
          amount: parsedAmount,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`POST /orders falhou: ${res.status} - ${txt}`);
      }

      pushToast({
        type: "success",
        title: "Pedido criado ✅",
        message: "O worker vai processar o status automaticamente.",
      });

      setCustomer("");
      setProduct("");
      setAmount("");

      await loadOrders();
    } catch (e: any) {
      pushToast({
        type: "error",
        title: "Erro ao criar pedido",
        message: e?.message ?? "Falha desconhecida",
      });
    }
  }

  async function openDetails(orderId: string) {
    setDetailsOpen(true);
    setSelectedOrder(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`);
      if (!res.ok) throw new Error(`GET /orders/${orderId} falhou: ${res.status}`);
      const data = (await res.json()) as Order;
      setSelectedOrder(data);
    } catch (e: any) {
      pushToast({
        type: "error",
        title: "Erro ao carregar detalhes",
        message: e?.message ?? "Falha desconhecida",
      });
      setDetailsOpen(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const t = setInterval(loadOrders, 5000); // polling
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <ToastHost toasts={toasts} onClose={closeToast} />

      <div className="mx-auto max-w-5xl p-6">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold">Order Management (POC)</h1>
          <p className="mt-2 text-sm text-slate-500">
            Criar pedidos, acompanhar status e visualizar detalhes. (Polling a cada 5s)
          </p>
        </header>

        {/* Criar pedido */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Criar pedido</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="md:col-span-1">
              <label className="text-sm font-semibold">Cliente</label>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Ex: Maria"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-sm font-semibold">Produto</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Ex: Teclado"
              />
            </div>

            <div className="md:col-span-1">
              <label className="text-sm font-semibold">Valor</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Ex: 199.90"
              />
            </div>

            <div className="md:col-span-1 flex items-end justify-end">
              <button
                onClick={createOrder}
                className="rounded-xl bg-black px-4 py-2 text-white font-semibold hover:opacity-90"
              >
                Criar
              </button>
            </div>
          </div>
        </section>

        {/* Lista */}
        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Pedidos</h2>
            <span className="text-sm text-slate-500">{total} itens</span>
          </div>

          <div className="mt-4">
            {loading ? (
              <TableSkeleton rows={4} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-slate-600">
                    <tr>
                      <th className="py-2">Cliente</th>
                      <th className="py-2">Produto</th>
                      <th className="py-2">Valor</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Criado em</th>
                      <th className="py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b last:border-b-0">
                        <td className="py-3">{o.customer}</td>
                        <td className="py-3">{o.product}</td>
                        <td className="py-3">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(o.amount)}
                        </td>
                        <td className="py-3">
                          <span
                            className={[
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                              statusBadge(o.status),
                            ].join(" ")}
                          >
                            <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                            {statusLabel(o.status)}
                          </span>
                        </td>
                        <td className="py-3">
                          {new Date(o.createdAt).toLocaleString("pt-BR")}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => openDetails(o.id)}
                            className="rounded-xl border px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}

                    {orders.length === 0 && (
                      <tr>
                        <td className="py-6 text-slate-500" colSpan={6}>
                          Nenhum pedido ainda. Crie o primeiro acima.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      <OrderDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
