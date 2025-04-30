import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { createContext, useContext, useState, ReactNode } from "react";

export type Transactions = Income | Expense;

interface LayoutContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setDialogState: (isOpen: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const setDialogState = (isOpen: boolean) => setIsDialogOpen(isOpen);

  return (
    <LayoutContext.Provider value={{ isDialogOpen, openDialog, closeDialog, setDialogState }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};