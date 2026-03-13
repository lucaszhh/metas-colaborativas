import { useEffect, useState } from "react";
import { useScopeMutations } from "@/modules/scopes/hooks/useScopeMutations";
import type { ScopeSummary } from "@/services/scopes.queries";

type UseScopeSectionParams = {
  userId: string | null;
  scopeId: string | null;
  scopes: ScopeSummary[];
  setActiveScopeId: (id: string | null) => void;
};

export function useScopeSection(params: UseScopeSectionParams) {
  const { userId, scopeId, scopes, setActiveScopeId } = params;
  const { updateScope, deleteScope } = useScopeMutations();

  const [editingScopeId, setEditingScopeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (editingScopeId && !scopes.some((scope) => scope.id === editingScopeId)) {
      setEditingScopeId(null);
      setEditingName("");
    }

    if (confirmDeleteId && !scopes.some((scope) => scope.id === confirmDeleteId)) {
      setConfirmDeleteId(null);
    }
  }, [scopes, editingScopeId, confirmDeleteId]);

  const handleSelectScope = (id: string) => {
    if (editingScopeId === id || confirmDeleteId === id) return;
    setActiveScopeId(id);
  };

  const startEditScope = (scope: ScopeSummary) => {
    setEditingScopeId(scope.id);
    setEditingName(scope.name);
    setConfirmDeleteId(null);
  };

  const cancelEditScope = () => {
    setEditingScopeId(null);
    setEditingName("");
  };

  const saveEditScope = async () => {
    if (!userId || !editingScopeId || updateScope.isPending) return;

    const name = editingName.trim();
    if (!name) return;

    await updateScope.mutateAsync({
      uid: userId,
      scopeId: editingScopeId,
      name,
    });

    cancelEditScope();
  };

  const requestDeleteScope = (id: string) => {
    setConfirmDeleteId(id);

    if (editingScopeId === id) {
      cancelEditScope();
    }
  };

  const cancelDeleteScope = () => setConfirmDeleteId(null);

  const confirmDeleteScope = async (id: string) => {
    if (!userId || deleteScope.isPending) return;

    await deleteScope.mutateAsync({
      uid: userId,
      scopeId: id,
    });

    if (confirmDeleteId === id) {
      setConfirmDeleteId(null);
    }
  };

  const isUpdatingScope = (id: string) =>
    updateScope.isPending && updateScope.variables?.scopeId === id;

  const isDeletingScope = (id: string) =>
    deleteScope.isPending && deleteScope.variables?.scopeId === id;

  return {
    scopes,
    scopeId,
    editingScopeId,
    editingName,
    confirmDeleteId,
    setEditingName,
    handleSelectScope,
    startEditScope,
    cancelEditScope,
    saveEditScope,
    requestDeleteScope,
    cancelDeleteScope,
    confirmDeleteScope,
    isUpdatingScope,
    isDeletingScope,
  };
}

export type ScopeSectionController = ReturnType<typeof useScopeSection>;
