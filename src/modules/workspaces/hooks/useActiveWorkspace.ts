import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/modules/auth/useSession";
import { useMyWorkspaces } from "@/modules/workspaces/hooks/useMyWorkspaces";
import { useUserSettings } from "@/modules/auth/hooks/useUserSettings";
import { useCreateWorkspace } from "@/modules/workspaces/hooks/useCreateWorkspace";
import { setActiveWorkspaceId as persistActiveWorkspaceId } from "@/modules/auth/services/userSettings";

export function useActiveWorkspace() {
  const { user, loading: sessionLoading } = useSession();
  const queryClient = useQueryClient();
  const createWorkspaceMutation = useCreateWorkspace();

  const { workspaces, loading: workspacesLoading, error: workspacesError } = useMyWorkspaces(
    user?.uid ?? null
  );
  const { settings, loading: settingsLoading, error: settingsError } = useUserSettings(
    user?.uid ?? null
  );

  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [pendingWorkspaceId, setPendingWorkspaceId] = useState<string | null>(null);

  const persistActiveWorkspace = useCallback(
    (id: string | null) => {
      if (!user) return;
      void persistActiveWorkspaceId(user.uid, id).catch(() => {
        // errors are surfaced via settingsError from the subscription
      });
    },
    [user]
  );

  const setActiveWorkspaceId = useCallback(
    (id: string | null) => {
      setWorkspaceId(id);
      setPendingWorkspaceId(id);
      if (user) {
        queryClient.setQueryData(["userSettings", user.uid], {
          activeWorkspaceId: id,
        });
      }
      persistActiveWorkspace(id);
    },
    [persistActiveWorkspace, queryClient, user]
  );

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      setWorkspaceId(null);
      setPendingWorkspaceId(null);
      return;
    }
  }, [user, sessionLoading]);

  useEffect(() => {
    if (sessionLoading || !user) return;
    if (workspacesLoading || settingsLoading) return;

    const preferred = settings.activeWorkspaceId ?? null;
    const preferredExists = preferred && workspaces.some((w) => w.id === preferred);

    if (pendingWorkspaceId && preferred === pendingWorkspaceId) {
      if (preferredExists) {
        setPendingWorkspaceId(null);
      } else {
        return;
      }
    }

    if (preferredExists) {
      setWorkspaceId(preferred);
      return;
    }

    if (pendingWorkspaceId) return;

    setWorkspaceId(null);

    if (preferred) {
      persistActiveWorkspace(null);
    }
  }, [
    sessionLoading,
    user,
    workspacesLoading,
    settingsLoading,
    workspaces,
    settings,
    pendingWorkspaceId,
    persistActiveWorkspace,
  ]);

  const createAndSelectWorkspace = useCallback(
    async (name: string) => {
      if (!user) throw new Error("No session");
      const newId = await createWorkspaceMutation.mutateAsync({ uid: user.uid, name });
      setActiveWorkspaceId(newId);
      return newId;
    },
    [user, setActiveWorkspaceId, createWorkspaceMutation]
  );

  return {
    user,
    sessionLoading,
    workspaces,
    workspaceId,
    loading: sessionLoading || workspacesLoading || settingsLoading,
    error: workspacesError ?? settingsError,
    setActiveWorkspaceId,
    createAndSelectWorkspace,
    creatingWorkspace: createWorkspaceMutation.isPending,
  };
}
