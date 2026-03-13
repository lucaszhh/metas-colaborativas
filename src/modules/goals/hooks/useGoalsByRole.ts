import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type GoalDoc, subscribeGoalsByRole } from "@/services/goals";

export function useGoalsByRole(scopeId: string | null, roleId: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [snapshotError, setSnapshotError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["goals", scopeId, roleId],
    queryFn: async () => [] as GoalDoc[],
    enabled: false,
    initialData: [] as GoalDoc[],
  });

  useEffect(() => {
    setReady(false);
    setSnapshotError(null);

    if (!scopeId || !roleId) return;

    const unsub = subscribeGoalsByRole({
      scopeId,
      roleId,
      onChange: (data) => {
        setSnapshotError(null);
        queryClient.setQueryData(["goals", scopeId, roleId], data);
        setReady(true);
      },
      onError: (e) => {
        setSnapshotError(e);
        setReady(true);
      },
    });

    return () => unsub();
  }, [scopeId, roleId, queryClient]);

  return {
    goals: (query.data ?? []) as GoalDoc[],
    loading: !!scopeId && !!roleId && !ready,
    error: snapshotError ?? query.error,
  };
}
