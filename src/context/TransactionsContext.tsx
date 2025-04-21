import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchTransactions } from "@/lib/transactions_db_operations";
import { Transaction } from "@/types/transactions";

interface TransactionsContextType {
  transactions: Transaction[] | undefined;
  loadTransactions: () => Promise<void>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[] | undefined>>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    if (data) setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, loadTransactions, setTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactionsContext must be used within a TransactionsContextProvider");
  }
  return context;
};
