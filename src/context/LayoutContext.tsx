import { format } from "date-fns";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";
import { toast } from "sonner";
import { es } from "date-fns/locale";

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

  // Periods
  periods: string[];
  selectedPeriod: string | null;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<string | null>>;
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

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );

  // Generate available periods
  const periods = useMemo(() => {
    const uniquePeriods = new Set<string>();
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const formattedPeriod = format(date, "MMMM-yyyy", { locale: es });
      uniquePeriods.add(formattedPeriod);
    });
    return Array.from(uniquePeriods).sort(
      (a, b) => new Date(`01-${b}`).getTime() - new Date(`01-${a}`).getTime() // Sort descending
    );
  }, [transactions]);

  // Selected period state (default to the most recent period)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(() =>
    periods.length > 0 ? periods[0] : null
  );

  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periods[0]); // Set the most recent period if not already selected
    }
  }, [periods, selectedPeriod]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedPaymentMethods([]);
    setSelectedTypes([]);
    setSelectedPaymentType(null);
    setSelectedPeriod(periods.length > 0 ? periods[0] : null);
  };

  // Sorting state
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

  // Filter and sort transactions
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

    // Filter by type (income/expense)
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

    // Filter by selected period
    if (selectedPeriod) {
      filtered = filtered.filter((transaction) => {
        const transactionPeriod = format(
          new Date(transaction.date),
          "MMMM-yyyy",
          { locale: es }
        );
        return transactionPeriod === selectedPeriod;
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
    selectedPeriod,
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
        periods,
        selectedPeriod,
        setSelectedPeriod,
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
