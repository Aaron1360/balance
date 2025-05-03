export type Installment = {
  amount: number; 
  due_date: Date; 
  paid_date?: Date; 
  status: "pendiente" | "pagado" | "vencido" | "cancelado"; 
};

export type Income = {
  type: string;
  id?: string;
  date: Date; 
  description: string;
  category: string;
  payment_method: string;
  payment_type: "unica" | "diferido"; 
  amount: number; 
  reference?: string;
  number_of_payments?: number;
  payment_frequency?: "Mensual" | "Quincenal" | "Semanal" | "Personalizado";
  installments?: Installment[];
  notes?: string;
  tags?: string[];
};