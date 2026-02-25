import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type GoalDoc, subscribeGoalsByList } from "@/services/goals";

export function useGoalsByList(workspaceId: string | null, listId: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [snapshotError, setSnapshotError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["goals", workspaceId, listId],
    queryFn: async () => [] as GoalDoc[],
    enabled: false,
    initialData: [] as GoalDoc[],
  });

  useEffect(() => {
    setReady(false);
    setSnapshotError(null);

    if (!workspaceId || !listId) return;

    const unsub = subscribeGoalsByList({
      workspaceId,
      listId,
      onChange: (data) => {
        setSnapshotError(null);
        queryClient.setQueryData(["goals", workspaceId, listId], data);
        setReady(true);
      },
      onError: (e) => {
        setSnapshotError(e);
        setReady(true);
      },
    });

    return () => unsub();
  }, [workspaceId, listId, queryClient]);

  return {
    goals: (query.data ?? []) as GoalDoc[],
    loading: !!workspaceId && !!listId && !ready,
    error: snapshotError ?? query.error,
  };
}
