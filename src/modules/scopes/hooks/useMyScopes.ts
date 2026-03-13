import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeMyScopes, type ScopeSummary } from "@/services/scopes.queries";

export function useMyScopes(uid: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["scopes", uid],
    queryFn: async () => [],
    enabled: false,
    initialData: [],
  });

  useEffect(() => {
    setReady(false);
    setError(null);

    if (!uid) return;

    const unsub = subscribeMyScopes({
      uid,
      onChange: (data) => {
        queryClient.setQueryData(["scopes", uid], data);
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
    scopes: (query.data ?? []) as ScopeSummary[],
    loading: !!uid && !ready,
    error: error ?? query.error,
  };
}
