import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/layout/Layout";
import Transactions from "./pages/Transactions";
// import { LayoutProvider } from "./context/LayoutContext";
import { TransactionsProvider } from "./context/TransactionsContext";
import { DialogProvider } from "./context/DialogContext";
import { InstallmentsProvider } from "./context/InstallmentsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TransactionsProvider>
        <DialogProvider>
          <InstallmentsProvider>
            <Layout />
          </InstallmentsProvider>
        </DialogProvider>
      </TransactionsProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/dashboard/transacciones"} replace />,
      },
      {
        path: "/dashboard/transacciones",
        element: <Transactions />,
      },
    ],
  },
  {
    path: "*", // 404 page
    element: <NotFoundPage />,
  },
]);

export default router;
