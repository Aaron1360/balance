import { createContext, useContext, useMemo, useCallback, useState, ReactNode } from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { toast } from "sonner";

export type Transactions = Income | Expense;

interface LayoutContextType {
  // Dialog state
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setDialogState: (isOpen: boolean) => void;

  // Transactions and filters
  transactions: Transactions[];
  filteredTransactions: Transactions[];
  isLoading: boolean;
  error: Error | null;
  handleRefresh: () => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedPaymentMethods: string[];
  setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPaymentType: string | null;
  setSelectedPaymentType: (type: string | null) => void;
  resetFilters: () => void;

  // Sorting
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const setDialogState = (isOpen: boolean) => setIsDialogOpen(isOpen);

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
  const transactions = useMemo(() => [...income, ...expense], [income, expense]);

  // Combine loading and error states
  const isLoading = isLoadingIncome || isLoadingExpense;
  const error = incomeError || expenseError;

  // Memoize the refresh function
  const handleRefresh = useCallback(() => {
    refetchIncome();
    refetchExpense();
    toast.success("Transacciones actualizadas");
  }, [refetchIncome, refetchExpense]);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCategories([]);
    setSelectedPaymentMethods([]);
    setSelectedTypes([]);
    setSelectedPaymentType(null);
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(
    null
  );

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by start date
    if (startDate) {
      filtered = filtered.filter((transaction) => new Date(transaction.date) >= startDate);
    }

    // Filter by end date
    if (endDate) {
      filtered = filtered.filter((transaction) => new Date(transaction.date) <= endDate);
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

    // Filter by type (income/expense)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((transaction) => selectedTypes.includes(transaction.type));
    }

    // Filter by payment type (one-time/deferred)
    if (selectedPaymentType) {
      filtered = filtered.filter((transaction) => transaction.payment_type === selectedPaymentType);
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
    startDate,
    endDate,
    selectedCategories,
    selectedPaymentMethods,
    selectedTypes,
    selectedPaymentType,
    sortConfig,
  ]);

  return (
    <LayoutContext.Provider
      value={{
        isDialogOpen,
        openDialog,
        closeDialog,
        setDialogState,
        transactions,
        filteredTransactions,
        isLoading,
        error,
        handleRefresh,
        searchTerm,
        setSearchTerm,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
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
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};