import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTableData } from "@/lib/db_operations";

export function useInsertTableData<T>(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, Omit<T, "id">>({
    mutationFn: (record: Omit<T, "id">) =>
      insertTableData<T>(tableName, record), 
    onSuccess: () => {
      // Invalidate the query to refetch data for the table
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
    onError: (error) => {
      console.error(`Error inserting data into ${tableName}:`, error);

      // Optionally, surface the error to the user (e.g., via a toast notification)
    },
  });
}