import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <LayoutContext.Provider value={{ isDialogOpen, openDialog, closeDialog, setIsDialogOpen}}>
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