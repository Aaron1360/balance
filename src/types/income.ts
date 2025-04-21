export type Income = {
    id: string;
    date: Date;
    description: string;
    category: string;
    paymentMethod: string;
    paymentType: string;
    amount: number;
    reference?: string;
    state?: string;
    notes?: string; 
    tags?: string[];
  };
  