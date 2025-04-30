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
import DialogTabs from "./DialogTabs";
import { Transactions } from "@/context/TransactionsContext";
import { useLayoutContext } from "@/context/LayoutContext";

interface TransactionsDialogBtnProps {
  icon?: LucideIcon;
  text?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  transaction?: Transactions;
}

export default function TransactionsDialogBtn({ icon: Icon, text, variant, transaction }: TransactionsDialogBtnProps) {
  const { isDialogOpen, openDialog, setDialogState } = useLayoutContext();

  return (
    // Store the current state of the dialog in the context
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setDialogState(open);
    }}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className="mx-2 flex-1" onClick={openDialog}>
          {Icon && <Icon className="h-4 w-4" />}
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
        <DialogTabs transaction={transaction} />
      </DialogContent>
    </Dialog>
  );
}
