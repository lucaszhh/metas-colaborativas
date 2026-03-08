import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { createWorkspace, deleteWorkspace, updateWorkspace } from "@/services/workspaces";
import type { WorkspaceSummary } from "@/services/workspaces.queries";

export function useWorkspaceMutations() {
  const queryClient = useQueryClient();

  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (id, variables) => {
      const key = ["workspaces", variables.uid];
      const prev = (queryClient.getQueryData(key) as WorkspaceSummary[] | undefined) ?? [];

      if (!prev.some((workspace) => workspace.id === id)) {
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

  const updateWorkspaceMutation = useMutation({
    mutationFn: (variables: { uid: string; workspaceId: string; name: string }) =>
      updateWorkspace({
        workspaceId: variables.workspaceId,
        name: variables.name,
      }),
    onMutate: async (variables) => {
      const key = ["workspaces", variables.uid];
      const prev = (queryClient.getQueryData(key) as WorkspaceSummary[] | undefined) ?? [];

      queryClient.setQueryData(
        key,
        prev.map((workspace) =>
          workspace.id === variables.workspaceId
            ? { ...workspace, name: variables.name }
            : workspace
        )
      );

      return { key, prev };
    },
    onSuccess: () => {
      sileo.success({
        title: "Workspace actualizado",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.prev ?? []);
      }

      sileo.error({
        title: "No se pudo actualizar el workspace",
      });
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: (variables: { uid: string; workspaceId: string }) =>
      deleteWorkspace({
        workspaceId: variables.workspaceId,
      }),
    onMutate: async (variables) => {
      const key = ["workspaces", variables.uid];
      const prev = (queryClient.getQueryData(key) as WorkspaceSummary[] | undefined) ?? [];

      queryClient.setQueryData(
        key,
        prev.filter((workspace) => workspace.id !== variables.workspaceId)
      );

      return { key, prev };
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: ["goalLists", variables.workspaceId],
      });
      queryClient.removeQueries({
        queryKey: ["goals", variables.workspaceId],
      });

      sileo.success({
        title: "Workspace eliminado",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.prev ?? []);
      }

      sileo.error({
        title: "No se pudo eliminar el workspace",
      });
    },
  });

  return {
    createWorkspace: createWorkspaceMutation,
    updateWorkspace: updateWorkspaceMutation,
    deleteWorkspace: deleteWorkspaceMutation,
  };
}
