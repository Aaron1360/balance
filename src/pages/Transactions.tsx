import { useState } from "react";
import { FilterPanel } from "@/components/transactions/FilterPanel";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionDetails } from "@/components/transactions/TransactionsDetails";
import { Transactions, useTransactionsContext } from "@/context/TransactionsContext";

export default function TransactionsPage() {
  const {
    filteredTransactions,
    transactions,
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
  } = useTransactionsContext();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const paymentMethods = Array.from(new Set(transactions.map((t) => t.payment_method)));

  const handleRowClick = (transaction: Transactions) => {
    setSelectedTransaction(transaction);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex flex-row w-full h-full max-w-screen gap-4 p-4 md:p-6">
      <FilterPanel
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedPaymentMethods={selectedPaymentMethods}
        setSelectedPaymentMethods={setSelectedPaymentMethods}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedPaymentType={selectedPaymentType}
        setSelectedPaymentType={setSelectedPaymentType}
        categories={categories}
        paymentMethods={paymentMethods}
        filteredCount={filteredTransactions.length}
        resetFilters={resetFilters}
      />

      <div className="flex-1">
        <TransactionsTable
          filteredTransactions={filteredTransactions}
          onRowClick={handleRowClick}
          sortConfig={sortConfig}
          requestSort={requestSort}
          isFilterOpen={isFilterOpen}
        />
      </div>

      <TransactionDetails
        transaction={selectedTransaction}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}