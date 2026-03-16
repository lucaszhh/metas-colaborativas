import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeUserSettings, type UserSettings } from "@/modules/auth/services/userSettings";

export function useUserSettings(uid: string | null) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const query = useQuery({
    queryKey: ["userSettings", uid],
    queryFn: async () =>
      ({
        activeScopeId: null,
        defaultRolesSeedVersion: null,
      }) as UserSettings,
    enabled: false,
    initialData: {
      activeScopeId: null,
      defaultRolesSeedVersion: null,
    } as UserSettings,
  });

  useEffect(() => {
    setReady(false);
    setError(null);

    if (!uid) return;

    const unsub = subscribeUserSettings({
      uid,
      onChange: (data) => {
        queryClient.setQueryData(["userSettings", uid], data);
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
    settings: (query.data ?? {
      activeScopeId: null,
      defaultRolesSeedVersion: null,
    }) as UserSettings,
    loading: !!uid && !ready,
    error: error ?? query.error,
  };
}
