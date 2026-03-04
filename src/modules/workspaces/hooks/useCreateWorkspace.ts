import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { createWorkspace } from "@/services/workspaces";
import { type WorkspaceSummary } from "@/services/workspaces.queries";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (id, variables) => {
      const key = ["workspaces", variables.uid];
      const prev = (queryClient.getQueryData(key) as WorkspaceSummary[] | undefined) ?? [];
      if (!prev.some((w) => w.id === id)) {
        queryClient.setQueryData(key, [
          { id, name: variables.name, ownerId: variables.uid },
          ...prev,
        ]);
      }
      sileo.success({
        title: "Workspace creado",
        description: variables.name,
      });
    },
    onError: () => {
      sileo.error({
        title: "No se pudo crear el workspace",
      });
    },
  });
}
