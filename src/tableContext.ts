import { createContext } from "react";
import { Transactions } from "./App";

export const tableContext = createContext<Transactions | undefined>(undefined)