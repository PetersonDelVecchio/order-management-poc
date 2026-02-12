import type { Order } from "../lib/types";
import { StatusBadge } from "./StatusBadge";

type Props = {
  orders: Order[];
  onOpen: (orderId: string) => void;
  loading?: boolean;
};

export function OrdersTable({ orders, onOpen, loading }: Props) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pedidos</h2>
        <span className="text-sm text-gray-500">
          {loading ? "Carregando..." : `${orders.length} itens`}
        </span>
      </div>

      <div className="mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr className="border-b">
              <th className="py-2 pr-4">Cliente</th>
              <th className="py-2 pr-4">Produto</th>
              <th className="py-2 pr-4">Valor</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Criado em</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-b-0">
                <td className="py-3 pr-4 whitespace-nowrap">{o.customer}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{o.product}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  R$ {o.amount.toFixed(2)}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <StatusBadge status={o.status} />
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="py-3 whitespace-nowrap">
                  <button
                    onClick={() => onOpen(o.id)}
                    className="rounded-xl border px-3 py-1.5 hover:bg-gray-50"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}

            {!loading && orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Nenhum pedido ainda. Crie o primeiro acima.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
