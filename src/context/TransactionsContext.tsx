import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";

export type Transactions = Income | Expense;

interface TransactionsContextType {
  transactions: Transactions[];
  handleRefresh: () => void;
  isLoading: boolean;
  error: Error | null; 
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: income, isLoading: isLoadingIncome, error: incomeError, refetch: refetchIncome } =
    useFetchTableData<Income>("incomes");
  const { data: expense, isLoading: isLoadingExpense, error: expenseError, refetch: refetchExpense } =
    useFetchTableData<Expense>("expenses");
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const isLoading = isLoadingIncome || isLoadingExpense;
  const error = incomeError || expenseError;

  // Combine income and expense data into transactions
  const loadTransactions = () => {
    setTransactions([...(income || []), ...(expense || [])]);
  };  
  
  // Fetch data for the first time
  useEffect(() => {
    loadTransactions();
  }
  , [income, expense]);
  
  // This function is used to update the transactions when the button is clicked
  const handleRefresh = () => {
    refetchIncome();
    refetchExpense();
  };

  const contextValue: TransactionsContextType = {
    transactions,
    handleRefresh,
    isLoading,
    error,
  };

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
