import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTableData } from "@/lib/db_operations";

export function useUpdateTableData<T>(tableName: string) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, { id: string; updatedRecord: Partial<T> }>({
    mutationFn: ({ id, updatedRecord }) =>
      updateTableData<T>(tableName, id, updatedRecord), // Mutation function
    onSuccess: () => {
      // Invalidate the query to refetch data for the table
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
    onError: (error) => {
      console.error(`Error updating data in ${tableName}:`, error);

      // Optionally, surface the error to the user (e.g., via a toast notification)
    },
  });
}