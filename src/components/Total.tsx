import { Transactions } from "@/App";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";

interface TotalProps {
  data: Transactions[];
}

function Total({ data }: TotalProps) {
  const totalAmount = data.reduce(
    (acc, current) => acc + Number(current.amount),
    0
  );
  
  return (
    <Card className="flex flex-1 w-full h-full">
      <CardHeader className="flex justify-center">
        <CardTitle>Total Expenses:</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full px-30">
        <div className="flex flex-1 justify-center items-center bg-black  rounded-2xl  ">
        <Label className="text-white text-lg font-bold">${totalAmount}</Label>
        </div>
      </CardContent>
    </Card>
  );
}

export default Total;
