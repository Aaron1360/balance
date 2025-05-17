import React, { createContext, useContext, useState } from "react";
import { toDate } from "date-fns-tz";
import { Installment } from "@/types/installment";
import { paymentFrequencyCategories } from "@/constants/categories";

interface InstallmentsContextType {
  installments: Installment[];
  setInstallments: (installments: Installment[]) => void;
  generateInstallments: (
    amount: number,
    numberOfPayments: number,
    paymentFrequency: typeof paymentFrequencyCategories[number],
    startDate: Date,
    isMsi: boolean,
    interestRate?: number
  ) => void;
}

const InstallmentsContext = createContext<InstallmentsContextType | undefined>(
  undefined
);

export const InstallmentsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [installments, setInstallments] = useState<Installment[]>([]);

  const generateInstallments = (
    amount: number,
    numberOfPayments: number,
    paymentFrequency: typeof paymentFrequencyCategories[number],
    startDate: Date,
    isMsi: boolean,
    interestRate: number = 0 // Default to 0 for cases without interest
  ) => {
    if (!startDate || numberOfPayments <= 0) return;

    const newInstallments: Installment[] = [];
    const baseAmount = isMsi
      ? amount / numberOfPayments // No interest for MSI
      : (amount * (1 + interestRate / 100)) / numberOfPayments; // Include interest

    for (let i = 0; i < numberOfPayments; i++) {
      let dueDate = new Date(startDate);

      if (paymentFrequency === "Mensual") {
        // Safely increment the month while preserving the day
        dueDate.setDate(1); // Temporarily set to the 1st to avoid overflow issues
        dueDate.setMonth(dueDate.getMonth() + i);
        const targetDay = startDate.getDate();
        const lastDayOfMonth = new Date(
          dueDate.getFullYear(),
          dueDate.getMonth() + 1,
          0
        ).getDate();
        dueDate.setDate(Math.min(targetDay, lastDayOfMonth));
      }

      if (paymentFrequency === "Quincenal") {
        // Calculate the due date by adding (i * 15 days) to the startDate
        dueDate = new Date(startDate);
        dueDate.setDate(startDate.getDate() + i * 15);
      }

      if (paymentFrequency === "Semanal") {
        // Calculate the due date by adding (i * 7 days) to the startDate
        dueDate = new Date(startDate);
        dueDate.setDate(startDate.getDate() + i * 7);
      }

      if (paymentFrequency === "Personalizado") {
        // Create a single installment by default
        dueDate = toDate(startDate, { timeZone: "America/Mexico_City" });
        newInstallments.push({
          amount: parseFloat(amount.toFixed(2)), // Use the full amount for the single installment
          due_date: dueDate,
          status: "pendiente",
        });
        break; // Exit the loop since only one installment is needed
      } else {
        // Convert the due date to the specified timezone
        dueDate = toDate(dueDate, { timeZone: "America/Mexico_City" });

        newInstallments.push({
          amount: parseFloat(baseAmount.toFixed(2)),
          due_date: dueDate,
          status: "pendiente",
        });
      }
    }

    setInstallments(newInstallments);
  };

  return (
    <InstallmentsContext.Provider
      value={{ installments, setInstallments, generateInstallments }}
    >
      {children}
    </InstallmentsContext.Provider>
  );
};

export const useInstallmentsContext = (): InstallmentsContextType => {
  const context = useContext(InstallmentsContext);
  if (!context) {
    throw new Error(
      "useInstallmentsContext must be used within an InstallmentsProvider"
    );
  }
  return context;
};
