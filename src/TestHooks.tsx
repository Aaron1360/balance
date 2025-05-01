import React, { useState } from "react";
import { useFetchTableData } from "@/hooks/useFetchTableData";
import { useUpdateTableData } from "@/hooks/useUpdateTableData";
import { useDeleteTableData } from "@/hooks/useDeleteTableData";
import { Transactions } from "@/context/LayoutContext";
import { Income } from "@/types/income";
import { Expense } from "@/types/expense";

export default function TestHooks() {
  const incomesQuery = useFetchTableData<Transactions>("incomes");
  const expensesQuery = useFetchTableData<Transactions>("expenses");

  const updateIncome = useUpdateTableData<Income>("incomes");
  const updateExpense = useUpdateTableData<Expense>("expenses");

  const deleteIncome = useDeleteTableData("incomes");
  const deleteExpense = useDeleteTableData("expenses");

  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleIncomeEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIncome) {
      updateIncome.mutate(
        { id: editingIncome.id!, updatedRecord: editingIncome },
        {
          onSuccess: () => {
            alert("Income record updated successfully!");
            setEditingIncome(null);
          },
          onError: (error) => {
            alert(`Failed to update income record: ${error.message}`);
          },
        }
      );
    }
  };

  const handleExpenseEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense.mutate(
        { id: editingExpense.id!, updatedRecord: editingExpense },
        {
          onSuccess: () => {
            alert("Expense record updated successfully!");
            setEditingExpense(null);
          },
          onError: (error) => {
            alert(`Failed to update expense record: ${error.message}`);
          },
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Transactions</h1>
      <div className="grid grid-cols-2 gap-6">
        {/* Incomes Section */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Incomes</h2>
          {editingIncome ? (
            <form onSubmit={handleIncomeEditSubmit} className="mt-4">
              <input
                type="text"
                placeholder="Description"
                value={editingIncome.description}
                onChange={(e) =>
                  setEditingIncome({
                    ...editingIncome,
                    description: e.target.value,
                  })
                }
                className="p-2 border rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingIncome.amount}
                onChange={(e) =>
                  setEditingIncome({
                    ...editingIncome,
                    amount: Number(e.target.value),
                  })
                }
                className="p-2 border rounded w-full mb-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingIncome(null)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          ) : (
            incomesQuery.data &&
            incomesQuery.data.length > 0 && (
              <ul className="space-y-4">
                {incomesQuery.data.map((income) => (
                  <li
                    key={income.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {income.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Amount: ${income.amount}
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {income.category}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingIncome(income as Income)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteIncome.mutate(income.id!)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        {/* Expenses Section */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Expenses</h2>
          {editingExpense ? (
            <form onSubmit={handleExpenseEditSubmit} className="mt-4">
              <input
                type="text"
                placeholder="Description"
                value={editingExpense.description}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    description: e.target.value,
                  })
                }
                className="p-2 border rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: Number(e.target.value),
                  })
                }
                className="p-2 border rounded w-full mb-2"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingExpense(null)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          ) : (
            expensesQuery.data &&
            expensesQuery.data.length > 0 && (
              <ul className="space-y-4">
                {expensesQuery.data.map((expense) => (
                  <li
                    key={expense.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {expense.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Amount: ${expense.amount}
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {expense.category}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingExpense(expense as Expense)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExpense.mutate(expense.id!)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
}