import { useEffect, useMemo, useState } from "react";
import { useRoles } from "@/modules/goals/hooks/useRoles";
import { useRoleMutations } from "@/modules/goals/hooks/useRoleMutations";
import type { RoleDoc } from "@/services/goals";

type UseRolesSectionParams = {
  scopeId: string | null;
  userId: string | null;
};

export function useRolesSection(params: UseRolesSectionParams) {
  const { scopeId, userId } = params;
  const { createRole, updateRole, deleteRole } = useRoleMutations();
  const { roles, loading, error } = useRoles(scopeId);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (roles.length === 0) {
      if (selectedRoleId) setSelectedRoleId(null);
      return;
    }

    const exists = selectedRoleId && roles.some((role) => role.id === selectedRoleId);
    if (!exists) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (editingRoleId && !roles.some((role) => role.id === editingRoleId)) {
      setEditingRoleId(null);
      setEditingTitle("");
    }

    if (confirmDeleteId && !roles.some((role) => role.id === confirmDeleteId)) {
      setConfirmDeleteId(null);
    }
  }, [roles, editingRoleId, confirmDeleteId]);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId]
  );

  const handleCreateRole = async () => {
    const title = newRoleTitle.trim();
    if (!title || !scopeId || !userId || createRole.isPending) return;

    const id = await createRole.mutateAsync({
      scopeId,
      uid: userId,
      title,
    });

    setNewRoleTitle("");
    setSelectedRoleId(id);
  };

  const handleSelectRole = (roleId: string) => {
    if (editingRoleId === roleId || confirmDeleteId === roleId) return;
    setSelectedRoleId(roleId);
  };

  const startEditRole = (role: RoleDoc) => {
    setEditingRoleId(role.id);
    setEditingTitle(role.title);
    setConfirmDeleteId(null);
  };

  const cancelEditRole = () => {
    setEditingRoleId(null);
    setEditingTitle("");
  };

  const saveEditRole = async () => {
    if (!scopeId || !editingRoleId || updateRole.isPending) return;

    const title = editingTitle.trim();
    if (!title) return;

    await updateRole.mutateAsync({
      scopeId,
      roleId: editingRoleId,
      title,
    });

    cancelEditRole();
  };

  const requestDeleteRole = (roleId: string) => {
    setConfirmDeleteId(roleId);

    if (editingRoleId === roleId) {
      cancelEditRole();
    }
  };

  const cancelDeleteRole = () => setConfirmDeleteId(null);

  const confirmDeleteRole = async (roleId: string) => {
    if (!scopeId || deleteRole.isPending) return;

    await deleteRole.mutateAsync({
      scopeId,
      roleId,
    });

    if (confirmDeleteId === roleId) {
      setConfirmDeleteId(null);
    }
  };

  const isUpdatingRole = (roleId: string) =>
    updateRole.isPending && updateRole.variables?.roleId === roleId;

  const isDeletingRole = (roleId: string) =>
    deleteRole.isPending && deleteRole.variables?.roleId === roleId;

  return {
    roles,
    loading,
    error,
    selectedRoleId,
    selectedRole,
    newRoleTitle,
    editingRoleId,
    editingTitle,
    confirmDeleteId,
    createRolePending: createRole.isPending,
    setNewRoleTitle,
    setSelectedRoleId: handleSelectRole,
    setEditingTitle,
    handleCreateRole,
    startEditRole,
    cancelEditRole,
    saveEditRole,
    requestDeleteRole,
    cancelDeleteRole,
    confirmDeleteRole,
    isUpdatingRole,
    isDeletingRole,
  };
}

export type RolesSectionController = ReturnType<typeof useRolesSection>;
