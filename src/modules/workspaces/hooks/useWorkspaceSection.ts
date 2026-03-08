import { useEffect, useState } from "react";
import { useWorkspaceMutations } from "@/modules/workspaces/hooks/useWorkspaceMutations";
import type { WorkspaceSummary } from "@/services/workspaces.queries";

type UseWorkspaceSectionParams = {
  userId: string | null;
  workspaceId: string | null;
  workspaces: WorkspaceSummary[];
  setActiveWorkspaceId: (id: string | null) => void;
};

export function useWorkspaceSection(params: UseWorkspaceSectionParams) {
  const { userId, workspaceId, workspaces, setActiveWorkspaceId } = params;
  const { updateWorkspace, deleteWorkspace } = useWorkspaceMutations();

  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (editingWorkspaceId && !workspaces.some((workspace) => workspace.id === editingWorkspaceId)) {
      setEditingWorkspaceId(null);
      setEditingName("");
    }

    if (confirmDeleteId && !workspaces.some((workspace) => workspace.id === confirmDeleteId)) {
      setConfirmDeleteId(null);
    }
  }, [workspaces, editingWorkspaceId, confirmDeleteId]);

  const handleSelectWorkspace = (id: string) => {
    if (editingWorkspaceId === id || confirmDeleteId === id) return;
    setActiveWorkspaceId(id);
  };

  const startEditWorkspace = (workspace: WorkspaceSummary) => {
    setEditingWorkspaceId(workspace.id);
    setEditingName(workspace.name);
    setConfirmDeleteId(null);
  };

  const cancelEditWorkspace = () => {
    setEditingWorkspaceId(null);
    setEditingName("");
  };

  const saveEditWorkspace = async () => {
    if (!userId || !editingWorkspaceId || updateWorkspace.isPending) return;

    const name = editingName.trim();
    if (!name) return;

    await updateWorkspace.mutateAsync({
      uid: userId,
      workspaceId: editingWorkspaceId,
      name,
    });

    cancelEditWorkspace();
  };

  const requestDeleteWorkspace = (id: string) => {
    setConfirmDeleteId(id);

    if (editingWorkspaceId === id) {
      cancelEditWorkspace();
    }
  };

  const cancelDeleteWorkspace = () => setConfirmDeleteId(null);

  const confirmDeleteWorkspace = async (id: string) => {
    if (!userId || deleteWorkspace.isPending) return;

    await deleteWorkspace.mutateAsync({
      uid: userId,
      workspaceId: id,
    });

    if (confirmDeleteId === id) {
      setConfirmDeleteId(null);
    }
  };

  const isUpdatingWorkspace = (id: string) =>
    updateWorkspace.isPending && updateWorkspace.variables?.workspaceId === id;

  const isDeletingWorkspace = (id: string) =>
    deleteWorkspace.isPending && deleteWorkspace.variables?.workspaceId === id;

  return {
    workspaces,
    workspaceId,
    editingWorkspaceId,
    editingName,
    confirmDeleteId,
    setEditingName,
    handleSelectWorkspace,
    startEditWorkspace,
    cancelEditWorkspace,
    saveEditWorkspace,
    requestDeleteWorkspace,
    cancelDeleteWorkspace,
    confirmDeleteWorkspace,
    isUpdatingWorkspace,
    isDeletingWorkspace,
  };
}

export type WorkspaceSectionController = ReturnType<typeof useWorkspaceSection>;
