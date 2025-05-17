import { useState } from "react";
import { MoreVertical, CheckIcon, XIcon } from "lucide-react";
import { useUpdateTableData } from "@/hooks/useUpdateTableData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DatePicker from "@/components/transactions-dialog/input-components/DatePicker";
import AmountInput from "@/components/transactions-dialog/input-components/AmountInput";
import { Installment } from "@/types/installment";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";

export function DeferredPaymentsTable({
  transaction,
}: {
  transaction: Income | Expense;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Installment | null>(null);

  // Dynamically set the table name based on transaction type
  const tableName = transaction.type === "income" ? "incomes" : "expenses";

  // Use the custom hook to update the database
  const { mutate: updateInstallments } = useUpdateTableData<Partial<Income | Expense>>(tableName);

  const handleEdit = (index: number) => {
    if (!transaction.installments) return;
    setEditingIndex(index);
    setEditForm({ ...transaction.installments[index] });
  };

  const handleDelete = (index: number) => {
    if (!transaction.installments) return;
    const updatedInstallments = transaction.installments.filter((_, i) => i !== index);

    // Update the database after deletion
    updateInstallments({
      id: transaction.id ?? "",
      updatedRecord: { ...transaction, installments: updatedInstallments },
    });
  };

  const handleSave = () => {
    if (editForm === null || editingIndex === null) return;

    const updatedInstallments = [...(transaction.installments ?? [])];
    updatedInstallments[editingIndex] = editForm;

    setEditingIndex(null);
    setEditForm(null);

    // Update the database after saving changes
    updateInstallments({
      id: transaction.id ?? "",
      updatedRecord: { ...transaction, installments: updatedInstallments },
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[70px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transaction.installments?.map((installment, index) => (
            <TableRow key={index}>
              <TableCell>
                {editingIndex === index ? (
                  <DatePicker
                    id={`due_date-${index}`}
                    date={editForm?.due_date ? new Date(editForm.due_date) : undefined}
                    setDate={(date) =>
                      setEditForm((prev) =>
                        prev ? { ...prev, due_date: date || prev.due_date } : null
                      )
                    }
                  />
                ) : (
                  new Date(installment.due_date).toLocaleDateString("es-MX")
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <AmountInput
                    id={`amount-${index}`}
                    placeholder="$0.00"
                    value={editForm?.amount || 0}
                    onChange={(value) =>
                      setEditForm((prev) => prev && { ...prev, amount: value })
                    }
                  />
                ) : (
                  installment.amount.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`cursor-pointer ${
                    installment.status === "pagado"
                      ? "bg-green-100 text-green-800"
                      : installment.status === "vencido"
                      ? "bg-red-100 text-red-800"
                      : installment.status === "cancelado"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {installment.status.charAt(0).toUpperCase() +
                    installment.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={handleSave}>
                      <CheckIcon className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleCancel}>
                      <XIcon className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(index)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(index)}
                        className="text-red-500"
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}