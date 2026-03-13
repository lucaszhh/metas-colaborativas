import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import { createGoal, deleteGoal, updateGoal, updateGoalStatus } from "@/services/goals";
import type { GoalDoc, GoalStatus } from "@/services/goals";

export function useGoalMutations() {
  const queryClient = useQueryClient();

  const createGoalItem = useMutation({
    mutationFn: createGoal,
    onSuccess: (id, variables) => {
      const key = ["goals", variables.scopeId, variables.roleId];
      const prev = (queryClient.getQueryData(key) as GoalDoc[] | undefined) ?? [];
      if (!prev.some((g) => g.id === id)) {
        queryClient.setQueryData(key, [
          {
            id,
            roleId: variables.roleId,
            title: variables.title,
            status: "open" as GoalStatus,
            createdBy: variables.uid,
            description: "",
          },
          ...prev,
        ]);
      }
      sileo.success({
        title: "Meta creada",
        description: variables.title,
      });
    },
    onError: () => {
      sileo.error({
        title: "No se pudo crear la meta",
      });
    },
  });

  const updateStatus = useMutation({
    mutationFn: (variables: {
      scopeId: string;
      roleId: string;
      goalId: string;
      status: GoalStatus;
    }) => updateGoalStatus({
      scopeId: variables.scopeId,
      goalId: variables.goalId,
      status: variables.status,
    }),
    onMutate: async (variables) => {
      const key = ["goals", variables.scopeId, variables.roleId];
      const prev = (queryClient.getQueryData(key) as GoalDoc[] | undefined) ?? [];
      queryClient.setQueryData(
        key,
        prev.map((g) => (g.id == variables.goalId ? { ...g, status: variables.status } : g))
      );
      return { key, prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.prev ?? []);
      }
      sileo.error({
        title: "No se pudo actualizar el estado",
      });
    },
  });

  const updateGoalDetails = useMutation({
    mutationFn: (variables: {
      scopeId: string;
      roleId: string;
      goalId: string;
      title: string;
      description: string;
    }) =>
      updateGoal({
        scopeId: variables.scopeId,
        goalId: variables.goalId,
        title: variables.title,
        description: variables.description,
      }),
    onMutate: async (variables) => {
      const key = ["goals", variables.scopeId, variables.roleId];
      const prev = (queryClient.getQueryData(key) as GoalDoc[] | undefined) ?? [];
      queryClient.setQueryData(
        key,
        prev.map((g) =>
          g.id == variables.goalId
            ? { ...g, title: variables.title, description: variables.description }
            : g
        )
      );
      return { key, prev };
    },
    onSuccess: () => {
      sileo.success({
        title: "Meta actualizada",
      });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.prev ?? []);
      }
      sileo.error({
        title: "No se pudo actualizar la meta",
      });
    },
  });

  const deleteGoalItem = useMutation({
    mutationFn: (variables: { scopeId: string; roleId: string; goalId: string }) =>
      deleteGoal({
        scopeId: variables.scopeId,
        goalId: variables.goalId,
      }),
    onMutate: async (variables) => {
      const key = ["goals", variables.scopeId, variables.roleId];
      const prev = (queryClient.getQueryData(key) as GoalDoc[] | undefined) ?? [];
      queryClient.setQueryData(
        key,
        prev.filter((g) => g.id != variables.goalId)
      );
      return { key, prev };
    },
    onSuccess: () => {
      sileo.success({
        title: "Meta eliminada",
      });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.key) {
        queryClient.setQueryData(ctx.key, ctx.prev ?? []);
      }
      sileo.error({
        title: "No se pudo eliminar la meta",
      });
    },
  });

  return {
    createGoal: createGoalItem,
    updateStatus,
    updateGoal: updateGoalDetails,
    deleteGoal: deleteGoalItem,
  };
}
