import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeMyWorkspaces, type WorkspaceSummary } from "@/services/workspaces.queries";

export function useMyWorkspaces(uid: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["workspaces", uid],
    queryFn: async () => [],
    enabled: false,
    initialData: [],
  });

  useEffect(() => {
    setReady(false);
    setError(null);

    if (!uid) return;

    const unsub = subscribeMyWorkspaces({
      uid,
      onChange: (data) => {
        queryClient.setQueryData(["workspaces", uid], data);
        setReady(true);
      },
      onError: (e) => {
        setError(e);
        setReady(true);
      },
    });

    return () => unsub();
  }, [uid, queryClient]);

  return {
    workspaces: (query.data ?? []) as WorkspaceSummary[],
    loading: !!uid && !ready,
    error: error ?? query.error,
  };
}
