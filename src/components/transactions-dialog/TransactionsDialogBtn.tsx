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
}

export default function TransactionsDialogBtn({
  icon: Icon,
  text,
  variant = "default",
  transaction,
  triggerAsChild = false,
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
        {triggerAsChild ? (
          <div
            className="flex flex-1 w-full items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            onClick={openDialog}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {text && <span className="whitespace-nowrap">{text}</span>}
          </div>
        ) : (
          // Default behavior: Render as a button
          <Button
            variant={variant}
            size="sm"
            className="mx-2 flex-1 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            onClick={openDialog}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {text}
          </Button>
        )}
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
