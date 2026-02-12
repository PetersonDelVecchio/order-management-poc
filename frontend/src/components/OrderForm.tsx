import { useState } from "react";
import type { CreateOrderRequest } from "../lib/types";

type Props = {
  onSubmit: (payload: CreateOrderRequest) => Promise<void>;
  loading?: boolean;
};

export function OrderForm({ onSubmit, loading }: Props) {
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = Number(amount);

    if (!customer.trim() || !product.trim() || !amount.trim()) {
      setError("Preencha cliente, produto e valor.");
      return;
    }
    if (Number.isNaN(value) || value <= 0) {
      setError("Valor deve ser um número maior que 0.");
      return;
    }

    await onSubmit({
      customer: customer.trim(),
      product: product.trim(),
      amount: value,
    });

    setCustomer("");
    setProduct("");
    setAmount("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 shadow-sm border"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Criar pedido</h2>
        {loading ? (
          <span className="text-sm text-gray-500">Salvando...</span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="text-sm text-gray-600">Cliente</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Ex: Maria"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Produto</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex: Teclado"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Valor</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="Ex: 199.90"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          disabled={!!loading}
          className="rounded-xl bg-black px-4 py-2 text-white font-medium hover:opacity-90 disabled:opacity-50"
          type="submit"
        >
          Criar
        </button>
      </div>
    </form>
  );
}
