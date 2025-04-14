import { useState } from "react";
// import { tableContext } from "@/context/TableContext";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { LuPencil, LuTrash2, LuCheck, LuX } from "react-icons/lu";
import AmountInput from "./expense-form/AmountInput";
import DateInput from "./expense-form/DateInput";
import CategorySelect from "./expense-form/CategorySelect";
import DescriptionInput from "./expense-form/DescriptionInput";
// import { Transactions } from "@/context/TableContext";
import { deleteTransaction, updateTransaction } from "@/CRUD-operations";
import { Transactions } from "@/App";

interface TransactionsTableProps {
  data: Transactions[];
  onUpdate: () => void;
}

export default function TransactionsTable({
  data,
  onUpdate,
}: TransactionsTableProps) {
  // const context = useContext(tableContext);
  // const data = context?.data || [];

  // Local state for table manipulation
  // const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Transactions>>({});

  // const handleDelete = async (id: string) => {
  //   setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  //   await deleteTransaction(id);
  // };

  const handleEditClick = (txn: Transactions) => {
    setEditingId(txn.id);
    setEditValues({ ...txn });
  };

  const handleEditChange = (
    field: keyof Transactions,
    value: string | number
  ) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    await updateTransaction(editingId, editValues);
    setEditingId(null);
    setEditValues({});
    onUpdate(); // Refresh table data from DB
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    onUpdate(); // Refresh table data after delete
  };

  return (
    <Card className="w-full mx-5">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((txn, index) => {
              const isEditing = editingId === txn.id;

              return (
                <TableRow key={txn.id}>
                  <TableCell>{index + 1}</TableCell>

                  {isEditing ? (
                    <>
                      <TableCell>
                        <AmountInput
                          value={editValues.amount ?? ""}
                          onChange={(v) =>
                            handleEditChange("amount", v? parseFloat(v) : 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <DateInput
                          value={editValues.date ?? ""}
                          onChange={(value) => handleEditChange("date", value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CategorySelect
                          value={editValues.category ?? ""}
                          onChange={(val) => handleEditChange("category", val)}
                        />
                      </TableCell>
                      <TableCell>
                        <DescriptionInput
                          value={editValues.description ?? ""}
                          onChange={(val) =>
                            handleEditChange("description", val)
                          }
                        />
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>${txn.amount}</TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>{txn.category}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                    </>
                  )}

                  <TableCell className="flex gap-2 justify-center">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          className="hover:bg-green-100 hover:text-green-600 transition-colors"
                          onClick={handleSaveEdit}
                        >
                          <LuCheck />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-gray-100"
                          onClick={handleCancelEdit}
                        >
                          <LuX />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          onClick={() => handleEditClick(txn)}
                        >
                          <LuPencil />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="hover:bg-red-500 hover:text-white transition-colors"
                          onClick={() => handleDelete(txn.id)}
                        >
                          <LuTrash2 />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
