import { useState, useEffect } from "react";
import { fetchTableData } from "@/lib/transactions_db_operations";

export function useFetchTableData<T>(tableName: string) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTableData<T>(tableName);
        setData(result);
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  return { data, isLoading, error };
}