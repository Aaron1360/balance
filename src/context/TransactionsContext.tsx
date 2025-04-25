import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { Income } from "@/types/income";
import { Outcome } from "@/types/outcome";

export type Transactions = Income | Outcome;

interface TransactionsContextType {
  transactions: Transactions[];
  handleRefresh: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: income, refetch: refetchIncome } =
    useFetchTableData<Income>("income");
  const { data: outcome, refetch: refetchOutcome } =
    useFetchTableData<Outcome>("outcome");
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  
  // Combine income and outcome data into transactions
  const loadTransactions = () => {
    setTransactions([...(income || []), ...(outcome || [])]);
  };  
  
  // Fetch data for the first time
  useEffect(() => {
    loadTransactions();
  }
  , [income, outcome]);
  
  // This function is used to update the transactions when the button is clicked
  const handleRefresh = () => {
    refetchIncome();
    refetchOutcome();
  };

  const contextValue: TransactionsContextType = {
    transactions,
    handleRefresh,
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
