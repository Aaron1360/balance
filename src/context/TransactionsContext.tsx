import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";

export type Transactions = Income | Expense;

interface TransactionsContextType {
  transactions: Transactions[];
  filteredTransactions: Transactions[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedPaymentMethods: string[];
  setSelectedPaymentMethods: (methods: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedPaymentType: string | null;
  setSelectedPaymentType: (type: string | null) => void;
  resetFilters: () => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const { data: income = [] } = useFetchTableData<Income>("incomes");
  const { data: expense = [] } = useFetchTableData<Expense>("expenses");

  const transactions = useMemo(() => [...income, ...expense], [income, expense]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((transaction) =>
        selectedCategories.includes(transaction.category)
      );
    }

    // Filter by payment methods
    if (selectedPaymentMethods.length > 0) {
      filtered = filtered.filter((transaction) =>
        selectedPaymentMethods.includes(transaction.payment_method)
      );
    }

    // Filter by types (income/expense)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((transaction) =>
        selectedTypes.includes(transaction.type)
      );
    }

    // Filter by payment type (one-time/deferred)
    if (selectedPaymentType) {
      filtered = filtered.filter(
        (transaction) => transaction.payment_type === selectedPaymentType
      );
    }

    // Sort transactions
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Transactions];
        const bValue = b[sortConfig.key as keyof Transactions];

        if ((aValue ?? "") < (bValue ?? "")) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if ((aValue ?? "") > (bValue ?? "")) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    transactions,
    searchTerm,
    selectedCategories,
    selectedPaymentMethods,
    selectedTypes,
    selectedPaymentType,
    sortConfig,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedPaymentMethods([]);
    setSelectedTypes([]);
    setSelectedPaymentType(null);
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        filteredTransactions,
        searchTerm,
        setSearchTerm,
        selectedCategories,
        setSelectedCategories,
        selectedPaymentMethods,
        setSelectedPaymentMethods,
        selectedTypes,
        setSelectedTypes,
        selectedPaymentType,
        setSelectedPaymentType,
        resetFilters,
        sortConfig,
        requestSort,
      }}
    >
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