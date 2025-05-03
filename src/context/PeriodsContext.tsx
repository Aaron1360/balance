import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Transactions } from "@/context/TransactionsContext";

interface PeriodsContextType {
  periods: string[];
  selectedPeriod: string | null;
  setSelectedPeriod: (period: string | null) => void;
}

const PeriodsContext = createContext<PeriodsContextType | undefined>(undefined);

export const PeriodsProvider = ({
  children,
  transactions,
}: {
  children: ReactNode;
  transactions: Transactions[];
}) => {
  const periods = useMemo(() => {
    const uniquePeriods = new Set<string>();
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const formattedPeriod = format(date, "MMMM-yyyy", { locale: es });
      uniquePeriods.add(formattedPeriod);
    });
    return Array.from(uniquePeriods).sort(
      (a, b) => new Date(`01-${b}`).getTime() - new Date(`01-${a}`).getTime()
    );
  }, [transactions]);

  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(() =>
    periods.length > 0 ? periods[0] : null
  );

  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periods[0]);
    }
  }, [periods, selectedPeriod]);

  return (
    <PeriodsContext.Provider value={{ periods, selectedPeriod, setSelectedPeriod }}>
      {children}
    </PeriodsContext.Provider>
  );
};

export const usePeriodsContext = (): PeriodsContextType => {
  const context = useContext(PeriodsContext);
  if (!context) {
    throw new Error("usePeriodsContext must be used within a PeriodsProvider");
  }
  return context;
};