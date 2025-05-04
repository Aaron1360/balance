// This file defines the Expense type, which represents an expense record in the application.
import { Installment } from "./installment";

export type Expense = {
  type: string;
  id?: string;
  date: Date;
  description: string;
  category: string;
  payment_method: string;
  payment_type: "unica" | "diferido"; 
  amount: number;
  merchant: string;
  reference?: string;
  number_of_payments?: number;
  payment_frequency?: "Mensual" | "Quincenal" | "Semanal"; 
  interest_rate?: number;
  is_msi?: boolean; 
  installments?: Installment[];
  notes?: string;
  tags?: string[];
};