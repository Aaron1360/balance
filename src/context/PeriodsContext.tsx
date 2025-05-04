import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Transactions } from "@/context/TransactionsContext";

interface PeriodsContextType {
  periods: string[];
  selectedPeriod: string | null;
  setSelectedPeriod: (period: string | null) => void;
  filteredTransactions: Transactions[];
  resetFilters: () => void;
}

const PeriodsContext = createContext<PeriodsContextType | undefined>(undefined);

export const PeriodsProvider = ({
  children,
  transactions,
  filteredTransactions: baseFilteredTransactions,
  resetFilters: parentResetFilters,
}: {
  children: ReactNode;
  transactions: Transactions[];
  filteredTransactions: Transactions[];
  resetFilters: () => void;
}) => {
  // Generate unique periods from transactions
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

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    if (!selectedPeriod) return baseFilteredTransactions;

    return baseFilteredTransactions.filter((transaction) => {
      const transactionPeriod = format(
        new Date(transaction.date),
        "MMMM-yyyy",
        { locale: es }
      );
      return transactionPeriod === selectedPeriod;
    });
  }, [baseFilteredTransactions, selectedPeriod]);

  // Set the most recent period if not already selected
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periods[0]);
    }
  }, [periods, selectedPeriod]);

  // Extend the resetFilters function to reset the selected period
  const resetFilters = () => {
    parentResetFilters(); // Call the parent resetFilters from TransactionsContext
    setSelectedPeriod(periods.length > 0 ? periods[0] : null); // Reset the period filter
  };

  return (
    <PeriodsContext.Provider
      value={{
        periods,
        selectedPeriod,
        setSelectedPeriod,
        filteredTransactions,
        resetFilters,
      }}
    >
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
