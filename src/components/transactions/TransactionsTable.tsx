import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Transactions } from "@/context/LayoutContext";
import { useOutletContext } from "react-router-dom";

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
  // // Get the transactions context
  // const { transactions, handleRefresh, isLoading, error } =
  //   useTransactionsContext();
  // const wasLoading = useRef(isLoading);

  // // Show a toast when the loading state changes
  // useEffect(() => {
  //   if (wasLoading.current && !isLoading && !error) {
  //     toast.success("Transacciones actualizadas");
  //   }
  //   wasLoading.current = isLoading;
  // }, [isLoading, error]);

  // // Show an error toast if there's an error
  // useEffect(() => {
  //   if (error) {
  //     toast.error("Error al actualizar las transacciones: " + error.message);
  //   }
  // }, [error]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Transacciones</CardTitle>
          {/* <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isLoading} // Disable button during loading or cooldown
            >
            {isLoading ? (
              "Actualizando..."
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </>
            )}
          </Button> */}
        </div>
      </CardHeader>
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
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron transacciones.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick(transaction)}
                  >
                    <TableCell className="font-medium">
                      {format(transaction.date, "dd/MM/yyyy")}
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
    </Card>
  );
}
