import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type GoalListDoc, subscribeGoalLists } from "@/services/goals";

export function useGoalLists(workspaceId: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [snapshotError, setSnapshotError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["goalLists", workspaceId],
    queryFn: async () => [] as GoalListDoc[],
    enabled: false,
    initialData: [] as GoalListDoc[],
  });

  useEffect(() => {
    setReady(false);
    setSnapshotError(null);

    if (!workspaceId) return;

    const unsub = subscribeGoalLists({
      workspaceId,
      onChange: (data) => {
        setSnapshotError(null);
        queryClient.setQueryData(["goalLists", workspaceId], data);
        setReady(true);
      },
      onError: (e) => {
        setSnapshotError(e);
        setReady(true);
      },
    });

    return () => unsub();
  }, [workspaceId, queryClient]);

  return {
    lists: (query.data ?? []) as GoalListDoc[],
    loading: !!workspaceId && !ready,
    error: snapshotError ?? query.error,
  };
}
