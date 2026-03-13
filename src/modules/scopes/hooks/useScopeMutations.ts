import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { createScope, deleteScope, updateScope } from "@/services/scopes";
import type { ScopeSummary } from "@/services/scopes.queries";

export function useScopeMutations() {
  const queryClient = useQueryClient();

  const createScopeMutation = useMutation({
    mutationFn: createScope,
    onSuccess: (id, variables) => {
      const key = ["scopes", variables.uid];
      const prev = (queryClient.getQueryData(key) as ScopeSummary[] | undefined) ?? [];

      if (!prev.some((scope) => scope.id === id)) {
        queryClient.setQueryData(key, [
          { id, name: variables.name, ownerId: variables.uid },
          ...prev,
        ]);
      }

      sileo.success({
        title: "Ambito creado",
        description: variables.name,
      });
    },
    onError: () => {
      sileo.error({
        title: "No se pudo crear el ambito",
      });
    },
  });

  const updateScopeMutation = useMutation({
    mutationFn: (variables: { uid: string; scopeId: string; name: string }) =>
      updateScope({
        scopeId: variables.scopeId,
        name: variables.name,
      }),
    onMutate: async (variables) => {
      const key = ["scopes", variables.uid];
      const prev = (queryClient.getQueryData(key) as ScopeSummary[] | undefined) ?? [];

      queryClient.setQueryData(
        key,
        prev.map((scope) =>
          scope.id === variables.scopeId
            ? { ...scope, name: variables.name }
            : scope
        )
      );

      return { key, prev };
    },
    onSuccess: () => {
      sileo.success({
        title: "Ambito actualizado",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.prev ?? []);
      }

      sileo.error({
        title: "No se pudo actualizar el ambito",
      });
    },
  });

  const deleteScopeMutation = useMutation({
    mutationFn: (variables: { uid: string; scopeId: string }) =>
      deleteScope({
        scopeId: variables.scopeId,
      }),
    onMutate: async (variables) => {
      const key = ["scopes", variables.uid];
      const prev = (queryClient.getQueryData(key) as ScopeSummary[] | undefined) ?? [];

      queryClient.setQueryData(
        key,
        prev.filter((scope) => scope.id !== variables.scopeId)
      );

      return { key, prev };
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: ["roles", variables.scopeId],
      });
      queryClient.removeQueries({
        queryKey: ["goals", variables.scopeId],
      });

      sileo.success({
        title: "Ambito eliminado",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.prev ?? []);
      }

      sileo.error({
        title: "No se pudo eliminar el ambito",
      });
    },
  });

  return {
    createScope: createScopeMutation,
    updateScope: updateScopeMutation,
    deleteScope: deleteScopeMutation,
  };
}
