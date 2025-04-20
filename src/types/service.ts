export type ServiceFrequency =
  | "monthly"
  | "bimonthly"
  | "quarterly"
  | "semiannual"
  | "annual"
  | "custom";

export type ServiceStatus = "active" | "paused" | "canceled";

export type ServiceCategory =
  | "servicio básico"
  | "streaming"
  | "software"
  | "suscripción"
  | "membresía"
  | "seguro"
  | "otro";

export type PaymentMethod =
  | "tarjeta de crédito"
  | "tarjeta de débito"
  | "efectivo"
  | "transferencia"
  | "domiciliación"
  | "otro";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  cost: number;
  minimumPayment: number;
  frequency: ServiceFrequency;
  customFrequencyDays?: number;
  nextPaymentDate: Date;
  paymentMethod?: PaymentMethod;
  status: ServiceStatus;
  paymentStatus: "pagado" | "próximo" | "vencido" | "pendiente";
  creditor?: string;
  note?: string;
  paymentDay: number; // Added paymentDay property
  description?: string;
  logo?: string;
  color?: string;
  autoRenewal?: boolean;
  reminderDays?: number;
  tags?: string[];
};

export type ServicePayment = {
  id: string;
  serviceId: string;
  date: number | Date;
  amount: number;
  status: "completed" | "pending" | "failed";
  paymentMethod?: PaymentMethod;
  reference?: string;
  notes?: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  category: string;
  cost: number;
  minimumPayment: number;
  frequency: "monthly" | "yearly" | string; // expanded to include other frequencies
  nextPaymentDate: Date;
  paymentMethod: string;
  status: "active" | "canceled";
  description?: string; // Optional
  logo?: string; // Optional
  color?: string; // Optional
  autoRenewal?: boolean; // Optional
  reminderDays?: number; // Optional
  tags?: string[]; // Optional
};
