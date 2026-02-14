import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAlerts, createAlert, updateAlert, deleteAlert } from "@/api/alerts";
import type { IAlert, IAlertFormData } from "@/types";

export function useAlerts() {
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
  });

  const createMutation = useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IAlertFormData> }) =>
      updateAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlert,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["alerts"] });
      const previousAlerts = queryClient.getQueryData<IAlert[]>(["alerts"]);

      if (previousAlerts) {
        queryClient.setQueryData(
          ["alerts"],
          previousAlerts.filter((a) => a.id !== id),
        );
      }

      return { previousAlerts };
    },
    onError: (_err, _id, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(["alerts"], context.previousAlerts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return {
    alerts: alertsQuery.data || [],
    isPending: alertsQuery.isPending,
    error: alertsQuery.error,
    createAlert: createMutation.mutate,
    updateAlert: updateMutation.mutate,
    deleteAlert: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
