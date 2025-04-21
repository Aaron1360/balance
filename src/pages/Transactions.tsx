import { useState, useEffect } from "react";
import { FilterPanel } from "@/components/transactions/FilterPanel";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionDetails } from "@/components/transactions/TransactionsDetails";
import { transactionsData } from "@/data/transactions-data";
import { Transaction } from "@/types/transactions";

export default function TransactionsPage() {
  // FilterPanel props
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );
  const [showPaymentTypeFilter, setShowPaymentTypeFilter] = useState(false);

  // TransactionsTable props
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // TransactionsDetails props
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Extract unique categories
  const categories = Array.from(
    new Set(transactionsData.map((t) => t.category))
  );

  // Extract unique payment methods
  const paymentMethods = Array.from(
    new Set(transactionsData.map((t) => t.paymentMethod))
  );

  // Effect to show/hide the payment type filter
  useEffect(() => {
    if (selectedCategories.includes("Ingreso")) {
      setShowPaymentTypeFilter(true);
    } else {
      setShowPaymentTypeFilter(false);
      setSelectedPaymentType(null);
    }
  }, [selectedCategories]);

  // Function to sort transactions
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

  // Function to open the Sheet with the transaction details
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsSheetOpen(true);
  };

  // Function to reset the filters
  const resetFilters = () => {
    setSearchTerm("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCategories([]);
    setSelectedPaymentMethods([]);
    setSelectedTypes([]);
    setSelectedPaymentType(null);
  };

  // Filter and sort transactions
  let filteredTransactions = [...transactionsData];

  // Filter by search term
  if (searchTerm) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by start date
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.date >= startDate
    );
  }

  // Filter by end date
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.date <= endDate
    );
  }

  // Filter by categories
  if (selectedCategories.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedCategories.includes(transaction.category)
    );
  }

  // Filter by payment methods
  if (selectedPaymentMethods.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedPaymentMethods.includes(transaction.paymentMethod)
    );
  }

  // Filter by type (income/expense)
  if (selectedTypes.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedTypes.includes(transaction.type)
    );
  }

  // Filter by payment type (one-time/deferred)
  if (selectedPaymentType) {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.paymentType === selectedPaymentType
    );
  }

  if (sortConfig !== null) {
    const key = sortConfig.key as keyof (typeof filteredTransactions)[0];

    filteredTransactions.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Handle null or undefined values: treat them as lesser
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="flex flex-row w-full h-full max-w-screen gap-4 p-4 md:p-6">
      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedPaymentMethods={selectedPaymentMethods}
        setSelectedPaymentMethods={setSelectedPaymentMethods}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedPaymentType={selectedPaymentType}
        setSelectedPaymentType={setSelectedPaymentType}
        showPaymentTypeFilter={showPaymentTypeFilter}
        categories={categories}
        paymentMethods={paymentMethods}
        filteredCount={filteredTransactions.length}
        resetFilters={resetFilters}
      />

      {/* Transactions Table */}
      <div className="flex-1">
        <TransactionsTable
          transactions={filteredTransactions}
          onRowClick={handleRowClick}
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
      </div>

      {/* Transaction Details */}
      <TransactionDetails
        transaction={selectedTransaction}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
