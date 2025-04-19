import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, CreditCard, Clock, Info, Tag, Wallet, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Transaction } from "@/types/transactions"

interface TransactionDetailsProps {
  transaction: Transaction | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetails({ transaction, isOpen, onOpenChange }: TransactionDetailsProps) {
  if (!transaction) return null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Detalles de Transacción</span>
            <Badge
              className={cn(transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}
            >
              {transaction.type === "income" ? "Ingreso" : "Gasto"}
            </Badge>
          </SheetTitle>
          <SheetDescription>ID: {transaction.id}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Información principal */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{transaction.description}</h3>
            <p className={cn("text-2xl font-bold", transaction.type === "income" ? "text-green-600" : "text-red-600")}>
              {transaction.amount.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </p>
          </div>

          <Separator />

          {/* Detalles básicos */}
          <div className="space-y-3">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Fecha</p>
                <p className="text-sm text-muted-foreground">
                  {format(transaction.date, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Tag className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Categoría</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Wallet className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Método de pago</p>
                <p className="text-sm text-muted-foreground">{transaction.paymentMethod}</p>
              </div>
            </div>

            {transaction.merchant && (
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Comercio</p>
                  <p className="text-sm text-muted-foreground">{transaction.merchant}</p>
                </div>
              </div>
            )}

            {transaction.reference && (
              <div className="flex items-start">
                <Receipt className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Referencia</p>
                  <p className="text-sm text-muted-foreground">{transaction.reference}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Detalles de pago */}
          <div className="space-y-3">
            <h4 className="font-semibold">Detalles de pago</h4>

            {transaction.type === "income" && transaction.paymentType && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Tipo de pago</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.paymentType === "unica" ? "Única exhibición" : "Pago diferido"}
                  </p>
                </div>
              </div>
            )}

            {transaction.msi && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Meses sin intereses</p>
                  <p className="text-sm text-muted-foreground">{transaction.msi} meses</p>
                </div>
              </div>
            )}

            {transaction.status && (
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Estado</p>
                  <Badge variant="outline" className="mt-1">
                    {transaction.status === "completed" && "Completado"}
                    {transaction.status === "pending" && "Pendiente"}
                    {transaction.status === "cancelled" && "Cancelado"}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Pagos diferidos (si aplica) */}
          {transaction.type === "income" && transaction.paymentType === "diferido" && transaction.msi && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Pagos programados</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: transaction.msi }).map((_, index) => {
                        const paymentDate = new Date(transaction.date)
                        paymentDate.setMonth(paymentDate.getMonth() + index)
                        
                        const paymentAmount =transaction.msi ? transaction.amount / transaction.msi : 0

                        return (
                          <TableRow key={index}>
                            <TableCell>{format(paymentDate, "dd/MM/yyyy")}</TableCell>
                            <TableCell>
                              {paymentAmount.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={index === 0 ? "bg-green-100 text-green-800" : ""}>
                                {index === 0 ? "Pagado" : "Pendiente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}

          {/* Notas */}
          {transaction.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Notas</h4>
                <p className="text-sm text-muted-foreground">{transaction.notes}</p>
              </div>
            </>
          )}

          {/* Etiquetas */}
          {transaction.tags && transaction.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {transaction.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button>Editar</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
