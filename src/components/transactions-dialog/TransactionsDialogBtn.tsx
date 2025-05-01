import { LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DialogTabs from "./DialogTabs";
import { Transactions, useLayoutContext } from "@/context/LayoutContext";

interface TransactionsDialogBtnProps {
  icon?: LucideIcon;
  text?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  transaction?: Transactions;
  triggerAsChild?: boolean;
  className?: string;
}

export default function TransactionsDialogBtn({
  icon: Icon,
  text,
  transaction,
  triggerAsChild = true,
  className = "",
}: TransactionsDialogBtnProps) {
  const { isDialogOpen, openDialog, setDialogState } = useLayoutContext();

  return (
    // Store the current state of the dialog in the context
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setDialogState(open);
      }}
    >
      <DialogTrigger asChild={triggerAsChild}>
        <div
          className={className}
          onClick={openDialog}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {text && <span className="whitespace-nowrap">{text}</span>}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar Transacción" : "Añadir Transacción"}
          </DialogTitle>
          <DialogDescription>
            Ingresa los detalles a continuación.
          </DialogDescription>
        </DialogHeader>
        <DialogTabs transaction={transaction} />
      </DialogContent>
    </Dialog>
  );
}
