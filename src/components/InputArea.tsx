import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AmountInput from "./expense-form/AmountInput";
import CategorySelect from "./expense-form/CategorySelect";
import DateInput from "./expense-form/DateInput";
import DescriptionInput from "./expense-form/DescriptionInput";
import { insertTransaction } from "@/CRUD-operations";
// import { tableContext } from "@/context/TableContext";

interface InputAreaProps {
  onSubmitSuccess: () => void;
}

function InputArea({ onSubmitSuccess }: InputAreaProps) {
  // const context = useContext(tableContext);

  // if (!context) {
  //   throw new Error("InputArea must be used within a TableContextProvider");
  // }

  // const { setShouldRefresh } = context;

  // Form state
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !date || !category) {
      alert("Fill your data.");
      return;
    }

    setLoading(true);

    try {
      await insertTransaction({
        amount: parseFloat(amount),
        date,
        category,
        description,
      });
      alert("Expense added");

      // Reset form
      setAmount("");
      setDate("");
      setCategory("");
      setDescription("");

      // 🔄 Notify parent to reload table
      onSubmitSuccess();
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Submission error:", e.message || e);
      } else {
        console.error("Unknown error:", e);
      }
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle>New Expense</CardTitle>
        <CardDescription>Test</CardDescription>
      </CardHeader>
      <div className="flex flex-row items-center">
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="grid items-center gap-1.5">
            <Label>Amount</Label>
            <AmountInput value={amount} onChange={setAmount} />
          </div>
          <div className="grid items-center gap-1.5">
            <Label>Date</Label>
            <DateInput value={date} onChange={setDate} />
          </div>
          <div className="grid items-center gap-1.5">
            <Label>Category</Label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>
          <div className="grid items-center gap-1.5">
            <Label>Description</Label>
            <DescriptionInput value={description} onChange={setDescription} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant={"default"}
            onClick={handleSubmit}
            disabled={loading}
            className="min-h-20"
          >
            {loading ? "Submitting..." : "Add Expense"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default InputArea;
