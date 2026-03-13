import { useEffect, useMemo, useState } from "react";
import { useGoalMutations } from "@/modules/goals/hooks/useGoalMutations";
import { useGoalsByRole } from "@/modules/goals/hooks/useGoalsByRole";
import type { GoalDoc, GoalStatus } from "@/services/goals";

type UseGoalsSectionParams = {
  scopeId: string | null;
  roleId: string | null;
  userId: string | null;
};

export function useGoalsSection(params: UseGoalsSectionParams) {
  const { scopeId, roleId, userId } = params;
  const { createGoal, updateStatus, updateGoal, deleteGoal } = useGoalMutations();
  const { goals, loading, error } = useGoalsByRole(scopeId, roleId);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setEditingGoalId(null);
    setEditingTitle("");
    setEditingDescription("");
    setConfirmDeleteId(null);
  }, [roleId]);

  const openGoals = useMemo(() => goals.filter((goal) => goal.status !== "close"), [goals]);
  const closedGoals = useMemo(() => goals.filter((goal) => goal.status === "close"), [goals]);

  const handleCreateGoal = async () => {
    const title = newGoalTitle.trim();
    if (!title || !scopeId || !roleId || !userId || createGoal.isPending) return;

    await createGoal.mutateAsync({
      scopeId,
      uid: userId,
      roleId,
      title,
    });

    setNewGoalTitle("");
  };

  const handleToggleGoal = (goalId: string, status: GoalStatus) => {
    if (!scopeId || !roleId) return;

    updateStatus.mutate({
      scopeId,
      roleId,
      goalId,
      status,
    });
  };

  const startEditGoal = (goal: GoalDoc) => {
    setEditingGoalId(goal.id);
    setEditingTitle(goal.title);
    setEditingDescription(goal.description ?? "");
    setConfirmDeleteId(null);
  };

  const cancelEditGoal = () => {
    setEditingGoalId(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const saveEditGoal = async () => {
    if (!scopeId || !roleId || !editingGoalId || updateGoal.isPending) return;

    const title = editingTitle.trim();
    if (!title) return;

    await updateGoal.mutateAsync({
      scopeId,
      roleId,
      goalId: editingGoalId,
      title,
      description: editingDescription.trim(),
    });

    cancelEditGoal();
  };

  const requestDeleteGoal = (goalId: string) => {
    setConfirmDeleteId(goalId);
    if (editingGoalId === goalId) {
      cancelEditGoal();
    }
  };

  const cancelDeleteGoal = () => setConfirmDeleteId(null);

  const confirmDeleteGoal = async (goalId: string) => {
    if (!scopeId || !roleId || deleteGoal.isPending) return;

    await deleteGoal.mutateAsync({
      scopeId,
      roleId,
      goalId,
    });

    if (confirmDeleteId === goalId) {
      setConfirmDeleteId(null);
    }
  };

  const isUpdatingStatus = (goalId: string) =>
    updateStatus.isPending && updateStatus.variables?.goalId === goalId;

  const isUpdatingGoal = (goalId: string) =>
    updateGoal.isPending && updateGoal.variables?.goalId === goalId;

  const isDeletingGoal = (goalId: string) =>
    deleteGoal.isPending && deleteGoal.variables?.goalId === goalId;

  return {
    goals,
    openGoals,
    closedGoals,
    loading,
    error,
    newGoalTitle,
    editingGoalId,
    editingTitle,
    editingDescription,
    confirmDeleteId,
    createGoalPending: createGoal.isPending,
    setNewGoalTitle,
    setEditingTitle,
    setEditingDescription,
    handleCreateGoal,
    handleToggleGoal,
    startEditGoal,
    cancelEditGoal,
    saveEditGoal,
    requestDeleteGoal,
    cancelDeleteGoal,
    confirmDeleteGoal,
    isUpdatingStatus,
    isUpdatingGoal,
    isDeletingGoal,
  };
}

export type GoalsSectionController = ReturnType<typeof useGoalsSection>;
