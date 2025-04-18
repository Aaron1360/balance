import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewTransactionTabs from "./NewTransactionTabs";

export default function NewTransactionBtn() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="mx-2">
          <Plus className="h-4 w-4" />
          Añadir Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Transacción</DialogTitle>
          <DialogDescription>
            Ingresa los detalles a continuación.
          </DialogDescription>
        </DialogHeader>
        <NewTransactionTabs/>
      </DialogContent>
    </Dialog>
  );
}
