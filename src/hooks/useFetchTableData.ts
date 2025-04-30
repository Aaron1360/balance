import { useQuery } from "@tanstack/react-query";
import { fetchTableData } from "@/lib/db_operations";

export function useFetchTableData<T>(tableName: string) {
  return useQuery<T[], Error>({
    queryKey: [tableName], // Query key
    queryFn: () => fetchTableData<T>(tableName) // Query function
  });
}