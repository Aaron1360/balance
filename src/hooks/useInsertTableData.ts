import { insertTableData } from "@/lib/transactions_db_operations";
import { useState } from "react";

export function useInsertTableData<T>(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertData = async (record: Omit<T, "id">) => {
    setIsLoading(true);
    setError(null);
    try {
      await insertTableData<T>(tableName, record);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { insertData, isLoading, error };
}