import { format } from "date-fns"
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Transaction } from "@/types/transactions"

interface TransactionsTableProps {
  transactions: Transaction[]
  onRowClick: (transaction: Transaction) => void
  sortConfig: { key: string; direction: "asc" | "desc" } | null
  requestSort: (key: string) => void
}

export function TransactionsTable({ transactions, onRowClick, requestSort }: TransactionsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Transacciones</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("date")}>
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("description")}>
                    Descripción
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("category")}>
                    Categoría
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("paymentMethod")}>
                    Método
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("type")}>
                    Tipo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("paymentType")}>
                    Modalidad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("msi")}>
                    MSI
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => requestSort("amount")}>
                    Monto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron transacciones.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick(transaction)}
                  >
                    <TableCell className="font-medium">{format(transaction.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
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
                      {transaction.paymentType === "unica" && <span className="text-sm">Única exhibición</span>}
                      {transaction.paymentType === "diferido" && <span className="text-sm">Pago diferido</span>}
                    </TableCell>
                    <TableCell>
                      {transaction.msi ? (
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
                        transaction.type === "income" ? "text-green-600" : "text-red-600",
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
        </div>
      </CardContent>
    </Card>
  )
}
