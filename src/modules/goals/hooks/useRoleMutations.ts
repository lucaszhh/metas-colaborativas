import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import {
  createRole as createRoleRequest,
  deleteRole as deleteRoleRequest,
  updateRole as updateRoleRequest,
  type GoalDoc,
  type RoleDoc,
} from "@/services/goals";

export function useRoleMutations() {
  const queryClient = useQueryClient();

  const createRole = useMutation({
    mutationFn: createRoleRequest,
    onSuccess: (id, variables) => {
      const key = ["roles", variables.scopeId];
      const prev = (queryClient.getQueryData(key) as RoleDoc[] | undefined) ?? [];

      if (!prev.some((role) => role.id === id)) {
        queryClient.setQueryData(key, [
          {
            id,
            title: variables.title,
            createdBy: variables.uid,
          },
          ...prev,
        ]);
      }

      sileo.success({
        title: "Rol creado",
        description: variables.title,
      });
    },
    onError: () => {
      sileo.error({
        title: "No se pudo crear el rol",
      });
    },
  });

  const updateRole = useMutation({
    mutationFn: updateRoleRequest,
    onMutate: async (variables) => {
      const key = ["roles", variables.scopeId];
      const prev = (queryClient.getQueryData(key) as RoleDoc[] | undefined) ?? [];

      queryClient.setQueryData(
        key,
        prev.map((role) =>
          role.id === variables.roleId ? { ...role, title: variables.title } : role
        )
      );

      return { key, prev };
    },
    onSuccess: () => {
      sileo.success({
        title: "Rol actualizado",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.prev ?? []);
      }

      sileo.error({
        title: "No se pudo actualizar el rol",
      });
    },
  });

  const deleteRole = useMutation({
    mutationFn: deleteRoleRequest,
    onMutate: async (variables) => {
      const rolesKey = ["roles", variables.scopeId];
      const goalsKey = ["goals", variables.scopeId, variables.roleId];
      const prevRoles = (queryClient.getQueryData(rolesKey) as RoleDoc[] | undefined) ?? [];
      const prevGoals = (queryClient.getQueryData(goalsKey) as GoalDoc[] | undefined) ?? [];

      queryClient.setQueryData(
        rolesKey,
        prevRoles.filter((role) => role.id !== variables.roleId)
      );
      queryClient.setQueryData(goalsKey, []);

      return { rolesKey, goalsKey, prevRoles, prevGoals };
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: ["goals", variables.scopeId, variables.roleId],
      });

      sileo.success({
        title: "Rol eliminado",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.rolesKey) {
        queryClient.setQueryData(context.rolesKey, context.prevRoles ?? []);
      }

      if (context?.goalsKey) {
        queryClient.setQueryData(context.goalsKey, context.prevGoals ?? []);
      }

      sileo.error({
        title: "No se pudo eliminar el rol",
      });
    },
  });

  return {
    createRole,
    updateRole,
    deleteRole,
  };
}
