import { useState } from "react";
import { deleteTableData } from "@/lib/transactions_db_operations";

export function useDeleteTableData(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTableData(tableName, id);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteData, isLoading, error };
}