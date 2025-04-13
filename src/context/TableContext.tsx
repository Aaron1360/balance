import React, { createContext, useState, useEffect } from "react";
import { fetchTransactions } from "@/CRUD-operations";

export interface Transactions {
  id: string;
  amount: string | number;
  date: string;
  category: string;
  description: string;
}

interface TableContextValue {
  data: Transactions[] | undefined;
  shouldRefresh: boolean;
  setShouldRefresh: (val: boolean) => void;
}

export const tableContext = createContext<TableContextValue | undefined>(undefined);

export function TableContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Transactions[] | undefined>(undefined);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  useEffect(() => {
    const refresh = async () => {
      const fetched = await fetchTransactions();
      if (fetched) {
        setData(fetched);
        setShouldRefresh(false); // reset flag
      }
    };

    if (shouldRefresh) refresh();
  }, [shouldRefresh]);

  return (
    <tableContext.Provider value={{ data, shouldRefresh, setShouldRefresh }}>
      {children}
    </tableContext.Provider>
  );
}
