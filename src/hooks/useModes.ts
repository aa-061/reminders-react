import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMode, deleteMode, fetchModes, updateMode } from "@/api/modes";
import type { IMode, IModeFormData } from "@/types";

export function useModes() {
  const queryClient = useQueryClient();

  const modesQuery = useQuery({
    queryKey: ["modes"],
    queryFn: fetchModes,
  });

  const createMutation = useMutation({
    mutationFn: createMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IModeFormData> }) =>
      updateMode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMode,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["modes"] });
      const previousModes = queryClient.getQueryData<IMode[]>(["modes"]);

      if (previousModes) {
        queryClient.setQueryData(
          ["modes"],
          previousModes.filter((m) => m.id !== id),
        );
      }

      return { previousModes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousModes) {
        queryClient.setQueryData(["modes"], context.previousModes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["modes"] });
    },
  });

  return {
    modes: modesQuery.data || [],
    isPending: modesQuery.isPending,
    error: modesQuery.error,
    createMode: createMutation.mutate,
    updateMode: updateMutation.mutate,
    deleteMode: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
