import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DatePicker from "@/components/transactions-dialog/input-components/DatePicker";
import AmountInput from "@/components/transactions-dialog/input-components/AmountInput";
import { CheckIcon, XIcon, TrashIcon, PencilIcon } from "lucide-react";
import { Installment } from "@/types/installment";

export function DeferredPaymentsTable({ installments, setInstallments }: { installments: Installment[]; setInstallments: (installments: Installment[]) => void }) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Installment | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...installments[index] });
  };

  const handleDelete = (index: number) => {
    const updatedInstallments = installments.filter((_, i) => i !== index);
    setInstallments(updatedInstallments);
  };

  const handleSave = () => {
    if (editForm === null || editingIndex === null) return;

    const updatedInstallments = [...installments];
    updatedInstallments[editingIndex] = editForm;

    setInstallments(updatedInstallments);
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleStatusChange = (
      index: number,
      newStatus: "pendiente" | "pagado" | "vencido" | "cancelado"
  ) => {
      const updatedInstallments = [...installments];
      updatedInstallments[index].status = newStatus;
      setInstallments(updatedInstallments);
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
          {installments.map((installment, index) => (
            <TableRow key={index}>
              <TableCell>
                {editingIndex === index ? (
                  <DatePicker
                    id={`due_date-${index}`}
                    date={new Date(installment.due_date)}
                    setDate={(date) =>
                      setEditForm((prev) => prev ? { ...prev, due_date: date || prev.due_date } : null)
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
                    value={installment.amount}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
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
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["Pagado", "Pendiente", "Atrasado", "Cancelado"].map(
                      (status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(index, status.toLowerCase() as "pendiente" | "pagado" | "vencido" | "cancelado")}
                        >
                          {status}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(index)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}