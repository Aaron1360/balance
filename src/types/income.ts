export type Income = {
  date: Date;
  description: string;
  category: string;
  payment_method: string;
  payment_type: string;
  amount: number;
  reference?: string;
  number_of_payments?: number;
  payment_frequency?: string;
  installments?: string[];  // Optional: Only if your DB supports arrays
  state?: string;
  notes?: string;
  tags?: string[];          // Optional: Only if your DB supports arrays
};
