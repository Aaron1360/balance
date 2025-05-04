import { useEffect } from "react";
import {
  Calendar,
  CreditCard,
  Clock,
  Tag,
  Wallet,
  Receipt,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TransactionsDialogBtn from "../transactions-dialog/TransactionsDialogBtn";
import { cn } from "@/lib/utils";
import { useDeleteTableData } from "@/hooks/useDeleteTableData";
import { toast } from "sonner";
import { Transactions } from "@/context/TransactionsContext";
import { useDialogContext } from "@/context/DialogContext";
import { formatDate } from "@/lib/dateUtils";

interface TransactionDetailsProps {
  transaction: Transactions | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetails({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionDetailsProps) {
  const { isDialogOpen } = useDialogContext(); // Access dialog state from context

  // Determine the table name dynamically based on the transaction type
  const tableName = transaction?.type === "income" ? "incomes" : "expenses";

  // Use the useDeleteTableData hook
  const {
    mutate: deleteData,
    isPending: isDeleting,
    error: errorDeleting,
  } = useDeleteTableData(tableName);

  // Automatically close the sheet when the dialog is closed
  useEffect(() => {
    if (!isDialogOpen && isOpen) {
      onOpenChange(false); // Close the sheet
    }
  }, [isDialogOpen]);

  if (!transaction) return null;

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
      if (transaction.id) {
        deleteData(transaction.id, {
          onSuccess: () => {
            toast.success("Transacción eliminada");
            onOpenChange(false); // Close the sheet after successful deletion
          },
          onError: (error) => {
            toast.error(`Error al eliminar la transacción: ${error.message}`); // Show error toast in Spanish
          },
        });
      } else {
        console.error("Transaction ID is undefined.");
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Detalles de Transacción</span>
            <Badge
              className={cn(
                "text-sm",
                transaction.type === "income"
                  ? "bg-green-100 text-green-800 mx-10"
                  : "bg-red-100 text-red-800 mx-10"
              )}
            >
              {transaction.type === "income" ? "Ingreso" : "Gasto"}
            </Badge>
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {transaction.description}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Amount & Description */}
          <Card>
            <CardHeader>
              <CardTitle>{transaction.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  "text-3xl font-bold",
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {transaction.amount.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Basic Info */}
          <div className="space-y-4 mx-5">
            <InfoItem icon={<Calendar />} label="Fecha">
              {formatDate(transaction.date)}
            </InfoItem>

            <InfoItem icon={<Tag />} label="Categoría">
              {transaction.category}
            </InfoItem>

            <InfoItem icon={<Wallet />} label="Método de pago">
              {transaction.payment_method}
            </InfoItem>

            {"merchant" in transaction && (
              <InfoItem icon={<CreditCard />} label="Comercio">
                {transaction.merchant}
              </InfoItem>
            )}

            {transaction.reference && (
              <InfoItem icon={<Receipt />} label="Referencia">
                {transaction.reference}
              </InfoItem>
            )}
          </div>

          <Separator />

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transaction.type === "income" && transaction.payment_type && (
                <InfoItem icon={<Clock />} label="Tipo de pago">
                  {transaction.payment_type === "unica"
                    ? "Única exhibición"
                    : "Pago diferido"}
                </InfoItem>
              )}

              {"number_of_payments" in transaction && (
                <InfoItem icon={<Clock />} label="Número de pagos">
                  {transaction.payment_frequency === "Mensual"
                    ? "Mensual"
                    : transaction.payment_frequency === "Quincenal"
                    ? "Quincenal"
                    : transaction.payment_frequency === "Semanal"
                    ? "Semanal"
                    : transaction.payment_frequency === "Personalizado"
                    ? "Personalizado"
                    : "No definido"}{" "}
                  {transaction.number_of_payments}{" "}
                  {transaction.number_of_payments === 1 ? "pago" : "pagos"}
                </InfoItem>
              )}
            </CardContent>
          </Card>

          {/* Deferred Payments */}
          {transaction.installments && transaction.installments.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle>Pagos programados</CardTitle>
                </CardHeader>
                <CardContent>
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
                        {transaction.installments.map((installment, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {formatDate(installment.due_date)}
                            </TableCell>
                            <TableCell>
                              {installment.amount.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  installment.status === "pagado"
                                    ? "bg-green-100 text-green-800"
                                    : installment.status === "vencido"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                )}
                              >
                                {installment.status.charAt(0).toUpperCase() +
                                  installment.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notes */}
          {transaction.notes && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {transaction.notes}
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle>Etiquetas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {transaction.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-1 pt-6 mx-5">
          <Button size="icon" className="flex items-center gap-2">
            <TransactionsDialogBtn
              icon={Edit}
              transaction={transaction}
              triggerAsChild={true}
            />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 />
          </Button>
        </div>
        {/* Error Message */}
        {errorDeleting && (
          <div className="text-red-500 text-sm mt-2">
            Error al eliminar la transacción: {errorDeleting.message}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Small helper component
function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="space-y-0.5">
        <p className="font-medium">{label}</p>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
