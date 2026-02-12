import { http } from "./http.ts";
import type { CreateOrderRequest, Order } from "../types/order";

export async function listOrders(): Promise<Order[]> {
  const res = await http.get<Order[]>("/api/orders");
  return res.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await http.get<Order>(`/api/orders/${id}`);
  return res.data;
}

export async function createOrder(payload: CreateOrderRequest): Promise<{ id: string }> {
  const res = await http.post<{ id: string }>("/api/orders", payload);
  return res.data;
}
