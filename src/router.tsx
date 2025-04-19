import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import Report from "./pages/Report";
import Transactions from "./pages/Transactions";

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
    ],
  },
  {
    path: "*", // This will match any route that doesn't exist
    element: <NotFoundPage />,
  },
]);

export default router;
