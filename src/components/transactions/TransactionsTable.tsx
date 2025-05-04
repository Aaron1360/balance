import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { Transactions } from "@/context/TransactionsContext";
import { usePeriodsContext } from "@/context/PeriodsContext";
import { formatDate } from "@/lib/dateUtils";

interface TransactionsTableProps {
  filteredTransactions: Transactions[];
  onRowClick: (transaction: Transactions) => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  requestSort: (key: string) => void;
  isFilterOpen: boolean;
}

export function TransactionsTable({
  filteredTransactions,
  onRowClick,
  requestSort,
  isFilterOpen,
}: TransactionsTableProps) {
  // Get the sidebarState from the context
  const { sidebarState } = useOutletContext<{
    sidebarState: "expanded" | "collapsed";
  }>();

  const { periods, selectedPeriod, setSelectedPeriod } =
    usePeriodsContext();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset currentPage when filteredTransactions or selectedPeriod changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTransactions, selectedPeriod]);

  // Calculate paginated transactions
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle period change via Carousel
  const handlePeriodChange = (direction: "next" | "previous") => {
    const currentIndex = periods.indexOf(selectedPeriod || "");
    if (direction === "next" && currentIndex < periods.length - 1) {
      setSelectedPeriod(periods[currentIndex + 1]);
    } else if (direction === "previous" && currentIndex > 0) {
      setSelectedPeriod(periods[currentIndex - 1]);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 flex justify-between items-center">
        <CardTitle>Transacciones</CardTitle>
        <Carousel className="w-32 flex-shrink-0 mr-10">
          <CarouselPrevious
            onClick={() => handlePeriodChange("previous")}
            disabled={periods.indexOf(selectedPeriod || "") === 0}
          />
          <CarouselContent>
            <CarouselItem>
              <div className="text-center font-medium">
                {selectedPeriod || "Sin periodo"}
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselNext
            onClick={() => handlePeriodChange("next")}
            disabled={
              periods.indexOf(selectedPeriod || "") === periods.length - 1
            }
          />
        </Carousel>
      </CardHeader>
      {/* Table */}
      <ScrollArea
        className={cn(
          "w-full h-screen max-h-[700px] border rounded-md transition-all",
          sidebarState === "expanded" && isFilterOpen
            ? "max-w-[740px] md:max-w-[80%] lg:max-w-[95%]"
            : "max-w-full sm:max-w-[80%] md:max-w-[90%] lg:max-w-[95%]"
        )}
      >
        <CardContent className="flex flex-col items-center px-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("date")}
                  >
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("description")}
                  >
                    Descripción
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("category")}
                  >
                    Categoría
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("payment_method")}
                  >
                    Método
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("type")}
                  >
                    Tipo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("payment_type")}
                  >
                    Modalidad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("msi")}
                  >
                    MSI
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    className="p-0 font-medium"
                    onClick={() => requestSort("amount")}
                  >
                    Monto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron transacciones.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick(transaction)}
                  >
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                    <TableCell>
                      {transaction.type === "income" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <ArrowUp className="mr-1 h-3 w-3" />
                          Ingreso
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          <ArrowDown className="mr-1 h-3 w-3" />
                          Gasto
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.payment_type === "unica" && (
                        <span className="text-sm">Única exhibición</span>
                      )}
                      {transaction.payment_type === "diferido" && (
                        <span className="text-sm">Pago diferido</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {"msi" in transaction && transaction.msi ? (
                        <Badge variant="outline" className="font-mono">
                          {transaction.msi}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {transaction.amount.toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </CardContent>
      </ScrollArea>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 && (
                  <PaginationPrevious
                    // href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                )}
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    // href="#"
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                {currentPage < totalPages && (
                  <PaginationNext
                    // href="#"
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}
