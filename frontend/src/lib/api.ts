import type { CreateOrderRequest, Order } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5108";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  // alguns endpoints podem não retornar JSON (mas no nosso caso retorna)
  return (await res.json()) as T;
}

export const api = {
  getOrders: () => request<Order[]>("/api/orders"),
  getOrderById: (id: string) => request<Order>(`/api/orders/${id}`),
  createOrder: (payload: CreateOrderRequest) =>
    request<{ id: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
