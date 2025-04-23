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
  installments?: string[];  
  state?: string; // TODO: remove state value
  notes?: string;
  tags?: string[];          
};
