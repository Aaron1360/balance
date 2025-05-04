export type Installment = {
    amount: number;
    due_date: Date;
    paid_date?: Date;
    status: "pendiente" | "pagado" | "vencido" | "cancelado";
  };