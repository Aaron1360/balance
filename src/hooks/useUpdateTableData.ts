import { updateTableData } from "@/lib/transactions_db_operations";
import { useState } from "react";

export function useUpdateTableData<T>(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateData = async (id: string, updatedRecord: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateTableData<T>(tableName, id, updatedRecord);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateData, isLoading, error };
}
