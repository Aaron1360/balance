import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionFormTabs from "./TransactionFormTabs";
import { Transactions } from "@/context/TransactionsContext";
import { useLayoutContext } from "@/context/LayoutContext";

interface TransactionFormBtnProps {
  icon: LucideIcon;
  text?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  transaction?: Transactions;
}

export default function TransactionFormBtn({ icon: Icon, text, variant, transaction }: TransactionFormBtnProps) {
  const { isDialogOpen, openDialog, setIsDialogOpen } = useLayoutContext();

  return (
    // Store the current state of the dialog in the context
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className="mx-2" onClick={openDialog}>
          <Icon className="h-4 w-4" />
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
        <DialogTitle>{transaction ? "Editar Transacción" : "Añadir Transacción"}</DialogTitle>
          <DialogDescription>
            Ingresa los detalles a continuación.
          </DialogDescription>
        </DialogHeader>
        <TransactionFormTabs transaction={transaction} />
      </DialogContent>
    </Dialog>
  );
}
