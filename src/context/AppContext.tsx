import React, { createContext, useContext, useState } from "react";

const months = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const year = new Date().getFullYear();
const periods = months.map((month) => `${month} ${year}`);
const currentSummaryDate = periods[new Date().getMonth()];

export interface AppContextType {
  SummaryDate: string;
  setSummaryDate: React.Dispatch<React.SetStateAction<string>>;
  periods: string[];
  currentSummaryDate: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [SummaryDate, setSummaryDate] = useState<string>(currentSummaryDate);

  const contextValue: AppContextType = {
    SummaryDate,
    setSummaryDate,
    periods,
    currentSummaryDate,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
