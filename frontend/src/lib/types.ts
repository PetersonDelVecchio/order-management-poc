export type OrderStatus = 0 | 1 | 2;

export type Order = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  createdAt: string; // ISO
};

export type CreateOrderRequest = {
  customer: string;
  product: string;
  amount: number;
};

export const statusLabel = (s: OrderStatus) => {
  if (s === 0) return "Pending";
  if (s === 1) return "Processing";
  return "Finished";
};
