import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTableData } from "@/lib/db_operations";

export function useDeleteTableData(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteTableData(tableName, id), 
    onSuccess: () => {
      // Invalidate the query to refetch data for the table
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
    onError: (error) => {
      console.error(`Error deleting data from ${tableName}:`, error);

      // Optionally, surface the error to the user (e.g., via a toast notification)
    },
  });
}