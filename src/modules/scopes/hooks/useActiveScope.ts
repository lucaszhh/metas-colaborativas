import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/modules/auth/useSession";
import { useMyScopes } from "@/modules/scopes/hooks/useMyScopes";
import { useUserSettings } from "@/modules/auth/hooks/useUserSettings";
import { useCreateScope } from "@/modules/scopes/hooks/useCreateScope";
import {
  setActiveScopeId as persistActiveScopeId,
  type UserSettings,
} from "@/modules/auth/services/userSettings";
import {
  DEFAULT_ROLES_SEED_VERSION,
  seedDefaultRoles,
} from "@/services/defaultRoles";

function isLikelyFirstSignIn(creationTime?: string | null, lastSignInTime?: string | null) {
  const createdAtMs = Date.parse(creationTime ?? "");
  const lastSignInMs = Date.parse(lastSignInTime ?? "");

  if (Number.isNaN(createdAtMs) || Number.isNaN(lastSignInMs)) {
    return false;
  }

  return Math.abs(lastSignInMs - createdAtMs) < 60_000;
}

export function useActiveScope() {
  const { user, loading: sessionLoading } = useSession();
  const queryClient = useQueryClient();
  const createScopeMutation = useCreateScope();

  const { scopes, loading: scopesLoading, error: scopesError } = useMyScopes(
    user?.uid ?? null
  );
  const { settings, loading: settingsLoading, error: settingsError } = useUserSettings(
    user?.uid ?? null
  );

  const [scopeId, setScopeId] = useState<string | null>(null);
  const [pendingScopeId, setPendingScopeId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const persistActiveScope = useCallback(
    (id: string | null) => {
      if (!user) return;
      void persistActiveScopeId(user.uid, id).catch(() => {
        // errors are surfaced via settingsError from the subscription
      });
    },
    [user]
  );

  const setActiveScopeId = useCallback(
    (id: string | null) => {
      setScopeId(id);
      setPendingScopeId(id);
      if (user) {
        queryClient.setQueryData(
          ["userSettings", user.uid],
          (previous: UserSettings | undefined) => ({
            activeScopeId: id,
            defaultRolesSeedVersion: previous?.defaultRolesSeedVersion ?? null,
          })
        );
      }
      persistActiveScope(id);
    },
    [persistActiveScope, queryClient, user]
  );

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      setScopeId(null);
      setPendingScopeId(null);
      setSeeding(false);
      return;
    }
  }, [user, sessionLoading]);

  useEffect(() => {
    if (sessionLoading || !user) return;
    if (scopesLoading || settingsLoading) return;

    const alreadySeeded =
      settings.defaultRolesSeedVersion === DEFAULT_ROLES_SEED_VERSION;
    const shouldSeed =
      !alreadySeeded &&
      (scopes.length === 0 ||
        isLikelyFirstSignIn(
          user.metadata.creationTime,
          user.metadata.lastSignInTime
        ));

    if (!shouldSeed) {
      setSeeding(false);
      return;
    }

    let cancelled = false;
    setSeeding(true);

    void seedDefaultRoles(user.uid)
      .catch(() => {
        // keep initialization non-blocking; the next login can retry the seed
      })
      .finally(() => {
        if (!cancelled) {
          setSeeding(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [scopes.length, scopesLoading, sessionLoading, settings, settingsLoading, user]);

  useEffect(() => {
    if (sessionLoading || !user) return;
    if (scopesLoading || settingsLoading) return;
    if (seeding) return;

    const preferred = settings.activeScopeId ?? null;
    const preferredExists = preferred && scopes.some((w) => w.id === preferred);

    if (pendingScopeId && preferred === pendingScopeId) {
      if (preferredExists) {
        setPendingScopeId(null);
      } else {
        return;
      }
    }

    if (preferredExists) {
      setScopeId(preferred);
      return;
    }

    if (pendingScopeId) return;

    const fallbackScopeId = scopes[0]?.id ?? null;
    setScopeId(fallbackScopeId);

    if (preferred !== fallbackScopeId) {
      persistActiveScope(fallbackScopeId);
    }
  }, [
    sessionLoading,
    user,
    scopesLoading,
    settingsLoading,
    scopes,
    settings,
    pendingScopeId,
    persistActiveScope,
    seeding,
  ]);

  const createAndSelectScope = useCallback(
    async (name: string) => {
      if (!user) throw new Error("No session");
      const newId = await createScopeMutation.mutateAsync({ uid: user.uid, name });
      setActiveScopeId(newId);
      return newId;
    },
    [user, setActiveScopeId, createScopeMutation]
  );

  return {
    user,
    sessionLoading,
    scopes,
    scopeId,
    loading: sessionLoading || scopesLoading || settingsLoading || seeding,
    error: scopesError ?? settingsError,
    setActiveScopeId,
    createAndSelectScope,
    creatingScope: createScopeMutation.isPending,
  };
}
