import { insertTableData } from "@/lib/db_operations";
import { useState } from "react";

export function useInsertTableData<T>(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertData = async (record: Omit<T, "id">) => {
    setIsLoading(true);
    setError(null);
    try {
      await insertTableData<T>(tableName, record);
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return { insertData, isLoading, error };
}