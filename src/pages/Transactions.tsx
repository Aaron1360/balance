import { useState, useEffect } from "react"
import { FilterPanel } from "@/components/transactions/FilterPanel"
import { TransactionsTable } from "@/components/transactions/TransactionsTable"
import { TransactionDetails } from "@/components/transactions/TransactionsDetails"
import { transactionsData } from "@/data/transactions-data"
import { Transaction } from "@/types/transactions"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [showPaymentTypeFilter, setShowPaymentTypeFilter] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(true)

  // Extraer categorías únicas
  const categories = Array.from(new Set(transactionsData.map((t) => t.category)))

  // Extraer métodos de pago únicos
  const paymentMethods = Array.from(new Set(transactionsData.map((t) => t.paymentMethod)))

  // Efecto para mostrar/ocultar el filtro de tipo de pago
  useEffect(() => {
    if (selectedCategories.includes("Ingreso")) {
      setShowPaymentTypeFilter(true)
    } else {
      setShowPaymentTypeFilter(false)
      setSelectedPaymentType(null)
    }
  }, [selectedCategories])

  // Función para ordenar las transacciones
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Función para abrir el Sheet con los detalles de la transacción
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsSheetOpen(true)
  }

  // Función para resetear los filtros
  const resetFilters = () => {
    setSearchTerm("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedCategories([])
    setSelectedPaymentMethods([])
    setSelectedTypes([])
    setSelectedPaymentType(null)
  }

  // Filtrar y ordenar las transacciones
  let filteredTransactions = [...transactionsData]

  // Filtrar por término de búsqueda
  if (searchTerm) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Filtrar por fecha de inicio
  if (startDate) {
    filteredTransactions = filteredTransactions.filter((transaction) => transaction.date >= startDate)
  }

  // Filtrar por fecha de fin
  if (endDate) {
    filteredTransactions = filteredTransactions.filter((transaction) => transaction.date <= endDate)
  }

  // Filtrar por categorías
  if (selectedCategories.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedCategories.includes(transaction.category),
    )
  }

  // Filtrar por métodos de pago
  if (selectedPaymentMethods.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedPaymentMethods.includes(transaction.paymentMethod),
    )
  }

  // Filtrar por tipo (ingreso/gasto)
  if (selectedTypes.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) => selectedTypes.includes(transaction.type))
  }

  // Filtrar por tipo de pago (única/diferido)
  if (selectedPaymentType) {
    filteredTransactions = filteredTransactions.filter((transaction) => transaction.paymentType === selectedPaymentType)
  }

  if (sortConfig !== null) {
    const key = sortConfig.key as keyof typeof filteredTransactions[0];
  
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
  
//   // Ordenar las transacciones
//   if (sortConfig !== null) {
//     filteredTransactions.sort((a, b) => {
//       if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
//         return sortConfig.direction === "asc" ? -1 : 1
//       }
//       if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
//         return sortConfig.direction === "asc" ? 1 : -1
//       }
//       return 0
//     })
//   }

  return (
    // <div className="flex flex-col p-4 md:p-6">
      <div className="flex flex-row w-full h-full gap-4 p-4 md:p-6">
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
        <TransactionDetails transaction={selectedTransaction} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
      </div>
    // </div>
  )
}
