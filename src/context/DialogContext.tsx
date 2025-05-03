import { createContext, useContext, useState, ReactNode } from "react";

interface DialogContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setDialogState: (isOpen: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const setDialogState = (isOpen: boolean) => setIsDialogOpen(isOpen);

  return (
    <DialogContext.Provider
      value={{ isDialogOpen, openDialog, closeDialog, setDialogState }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
};