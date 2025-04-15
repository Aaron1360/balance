// src/pages/NotFoundPage.tsx
import React, { JSX } from "react";
import { Link } from "react-router-dom"; // Optional: Use Link to allow navigation
import { Button } from "@/components/ui/button";

const NotFoundPage = (): JSX.Element => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-lg text-gray-600 mb-6">Oops! La pagina que buscas no existe.</p>
        <Button className="text-white bg-gray-800 hover:bg-gray-600 py-2 px-6 rounded-lg text-xl">
        <Link
          to="/dashboard/estado-de-cuenta"
        >
          Regresa a tu estado de cuenta.
        </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
