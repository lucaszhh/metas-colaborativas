import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";
import {
  createGoalList,
  deleteGoalList,
  updateGoalList,
  type GoalDoc,
  type GoalListDoc,
} from "@/services/goals";

export function useGoalListMutations() {
  const queryClient = useQueryClient();

  const createList = useMutation({
    mutationFn: createGoalList,
    onSuccess: (id, variables) => {
      const key = ["goalLists", variables.workspaceId];
      const prev = (queryClient.getQueryData(key) as GoalListDoc[] | undefined) ?? [];

      if (!prev.some((list) => list.id === id)) {
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
        title: "Lista creada",
        description: variables.title,
      });
    },
    onError: () => {
      sileo.error({
        title: "No se pudo crear la lista",
      });
    },
  });

  const updateList = useMutation({
    mutationFn: updateGoalList,
    onMutate: async (variables) => {
      const key = ["goalLists", variables.workspaceId];
      const prev = (queryClient.getQueryData(key) as GoalListDoc[] | undefined) ?? [];

      queryClient.setQueryData(
        key,
        prev.map((list) =>
          list.id === variables.listId ? { ...list, title: variables.title } : list
        )
      );

      return { key, prev };
    },
    onSuccess: () => {
      sileo.success({
        title: "Lista actualizada",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.key) {
        queryClient.setQueryData(context.key, context.prev ?? []);
      }

      sileo.error({
        title: "No se pudo actualizar la lista",
      });
    },
  });

  const deleteList = useMutation({
    mutationFn: deleteGoalList,
    onMutate: async (variables) => {
      const listsKey = ["goalLists", variables.workspaceId];
      const goalsKey = ["goals", variables.workspaceId, variables.listId];
      const prevLists = (queryClient.getQueryData(listsKey) as GoalListDoc[] | undefined) ?? [];
      const prevGoals = (queryClient.getQueryData(goalsKey) as GoalDoc[] | undefined) ?? [];

      queryClient.setQueryData(
        listsKey,
        prevLists.filter((list) => list.id !== variables.listId)
      );
      queryClient.setQueryData(goalsKey, []);

      return { listsKey, goalsKey, prevLists, prevGoals };
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: ["goals", variables.workspaceId, variables.listId],
      });

      sileo.success({
        title: "Lista eliminada",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.listsKey) {
        queryClient.setQueryData(context.listsKey, context.prevLists ?? []);
      }

      if (context?.goalsKey) {
        queryClient.setQueryData(context.goalsKey, context.prevGoals ?? []);
      }

      sileo.error({
        title: "No se pudo eliminar la lista",
      });
    },
  });

  return {
    createList,
    updateList,
    deleteList,
  };
}
