import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import Report from "./pages/Report";
import Transactions from "./pages/Transactions";
import SavingsPage from "./pages/Savings";
import DebtPage from "./pages/Debts";
import ServiciosRoute from "./pages/Services";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <Layout />
    ),
    children: [
      {
        index: true,
        element: <Navigate to={"/dashboard/estado-de-cuenta"} replace/>,  
      },
      {
        path: "/dashboard/estado-de-cuenta",
        element: (
            <Report />
        ),
      },
      {
        path: "/dashboard/transacciones",
        element: (
            <Transactions />
        ),
      },
      {
        path: "/dashboard/ahorros",
        element: (
            <SavingsPage />
        ),
      },
      {
        path: "/dashboard/deudas",
        element: (
            <DebtPage />
        ),
      },
      {
        path: "/dashboard/servicios",
        element: (
            <ServiciosRoute />
        ),
      },
    ],
  },
  {
    path: "*", // This will match any route that doesn't exist
    element: <NotFoundPage />,
  },
]);

export default router;
