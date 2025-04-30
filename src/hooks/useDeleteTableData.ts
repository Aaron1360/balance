import { useState } from "react";
import { deleteTableData } from "@/lib/db_operations";

export function useDeleteTableData(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTableData(tableName, id);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteData, isLoading, error };
}