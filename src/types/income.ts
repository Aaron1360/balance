export type Income = {
    id: string;
    date: Date;
    description: string;
    category: string;
    paymentMethod: string;
    paymentType: string;
    amount: number;
    reference?: string;
    numberOfPayments?: number;
    paymentFrequency?: string[];
    installments?: string[];
    state?: string;
    notes?: string; 
    tags?: string[];
  };
  