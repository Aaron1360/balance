import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeTab from "./IncomeTab";
import ExpenseTab from "./ExpenseTab";
import { Transactions } from "@/context/TransactionsContext";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";

interface DialogTabsProps {
  transaction?: Transactions;
}

function DialogTabs({ transaction }: DialogTabsProps) {
  // Determine the default tab
  const defaultTab = transaction?.type === "income" ? "income" : "expense";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="income" disabled={transaction?.type === "expense"}>Ingreso</TabsTrigger>
        <TabsTrigger value="expense" disabled={transaction?.type === "income"}>Gasto</TabsTrigger>
      </TabsList>

      {/* Income Tab */}
      <TabsContent value="income">
        <IncomeTab transaction={transaction?.type === "income" ? (transaction as Income) : undefined} />
      </TabsContent>

      {/* Expense Tab */}
      <TabsContent value="expense">
        <ExpenseTab transaction={transaction?.type === "expense" ? (transaction as Expense) : undefined} />
      </TabsContent>
    </Tabs>
  );
}

export default DialogTabs;
