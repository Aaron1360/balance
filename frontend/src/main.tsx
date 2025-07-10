import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PurchasesProvider } from "@/context/PurchasesContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PurchasesProvider>
      <App />
    </PurchasesProvider>
  </React.StrictMode>
);
