import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type RoleDoc, subscribeRoles } from "@/services/goals";

export function useRoles(scopeId: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [snapshotError, setSnapshotError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["roles", scopeId],
    queryFn: async () => [] as RoleDoc[],
    enabled: false,
    initialData: [] as RoleDoc[],
  });

  useEffect(() => {
    setReady(false);
    setSnapshotError(null);

    if (!scopeId) return;

    const unsub = subscribeRoles({
      scopeId,
      onChange: (data) => {
        setSnapshotError(null);
        queryClient.setQueryData(["roles", scopeId], data);
        setReady(true);
      },
      onError: (e) => {
        setSnapshotError(e);
        setReady(true);
      },
    });

    return () => unsub();
  }, [scopeId, queryClient]);

  return {
    roles: (query.data ?? []) as RoleDoc[],
    loading: !!scopeId && !ready,
    error: snapshotError ?? query.error,
  };
}
