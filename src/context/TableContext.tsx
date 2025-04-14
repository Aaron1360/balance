import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchTransactions } from "../CRUD-operations";

export interface Transactions {
  id: string;
  amount: string | number;
  date: string;
  category: string;
  description: string;
}

interface TableContextType {
  transactions: Transactions[] | undefined;
  loadTransactions: () => Promise<void>;
  setTransactions: React.Dispatch<React.SetStateAction<Transactions[] | undefined>>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transactions[] | undefined>(undefined);

  const loadTransactions = async () => {
    const data = await fetchTransactions();
    if (data) setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <TableContext.Provider value={{ transactions, loadTransactions, setTransactions }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = (): TableContextType => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableContextProvider");
  }
  return context;
};
