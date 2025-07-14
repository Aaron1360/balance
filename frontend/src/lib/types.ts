type Purchase = {
  id: number;
  name: string;
  date: string;
  msi_term?: number | null; // optional, can be null for single payment
  card: string;
  amount: number;
  payments_made: number;
  category: string;
  paid?: boolean; // optional, present in backend
};

export type { Purchase };