import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { Transactions } from "./LayoutContext";
import { toast } from "sonner";

interface TransactionsContextType {
  transactions: Transactions[];
  isLoading: boolean;
  error: Error | null;
  handleRefresh: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Fetch income and expense data using React Query
  const {
    data: income = [],
    isLoading: isLoadingIncome,
    error: incomeError,
    refetch: refetchIncome,
  } = useFetchTableData<Income>("incomes");

  const {
    data: expense = [],
    isLoading: isLoadingExpense,
    error: expenseError,
    refetch: refetchExpense,
  } = useFetchTableData<Expense>("expenses");

  // Combine income and expense data into a single transactions array
  const transactions = useMemo(
    () => [...income, ...expense],
    [income, expense]
  );

  // Combine loading and error states
  const isLoading = isLoadingIncome || isLoadingExpense;
  const error = incomeError || expenseError;

  // Memoize the refresh function
  const handleRefresh = useCallback(() => {
    refetchIncome();
    refetchExpense();
    toast.success("Transacciones actualizadas");
  }, [refetchIncome, refetchExpense]);

  // Provide context value
  const contextValue = useMemo(
    () => ({
      transactions,
      isLoading,
      error,
      handleRefresh,
    }),
    [transactions, isLoading, error, handleRefresh]
  );

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactionsContext must be used within a TransactionsProvider"
    );
  }
  return context;
};