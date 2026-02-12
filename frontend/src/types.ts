export type Order = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: number; // 0 Pending, 1 Processing, 2 Finished
  createdAt: string;
};
