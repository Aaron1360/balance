import { useQuery } from "@tanstack/react-query";
import { fetchTableData } from "@/lib/db_operations";

export function useFetchTableData<T>(
  tableName: string,
  filters?: Record<string, string | number | boolean>
) {
  return useQuery<T[], Error>({
    queryKey: [tableName, filters], // Include filters in the query key
    queryFn: () => fetchTableData<T>(tableName, filters), // Pass filters to the fetch function
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on window focus
    // select: (data) => data.filter(item => item !== null),
  });
}
