// This file defines the Income type, which represents an income record in the application.
import { Installment } from "./installment";

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
  payment_frequency?: "Mensual" | "Quincenal" | "Semanal";
  installments?: Installment[];
  notes?: string;
  tags?: string[];
};