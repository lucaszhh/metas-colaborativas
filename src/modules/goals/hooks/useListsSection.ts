import { useEffect, useMemo, useState } from "react";
import { useGoalLists } from "@/modules/goals/hooks/useGoalLists";
import { useGoalListMutations } from "@/modules/goals/hooks/useGoalListMutations";
import type { GoalListDoc } from "@/services/goals";

type UseListsSectionParams = {
  workspaceId: string | null;
  userId: string | null;
};

export function useListsSection(params: UseListsSectionParams) {
  const { workspaceId, userId } = params;
  const { createList, updateList, deleteList } = useGoalListMutations();
  const { lists, loading, error } = useGoalLists(workspaceId);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (lists.length === 0) {
      if (selectedListId) setSelectedListId(null);
      return;
    }

    const exists = selectedListId && lists.some((list) => list.id === selectedListId);
    if (!exists) {
      setSelectedListId(lists[0].id);
    }
  }, [lists, selectedListId]);

  useEffect(() => {
    if (editingListId && !lists.some((list) => list.id === editingListId)) {
      setEditingListId(null);
      setEditingTitle("");
    }

    if (confirmDeleteId && !lists.some((list) => list.id === confirmDeleteId)) {
      setConfirmDeleteId(null);
    }
  }, [lists, editingListId, confirmDeleteId]);

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) ?? null,
    [lists, selectedListId]
  );

  const handleCreateList = async () => {
    const title = newListTitle.trim();
    if (!title || !workspaceId || !userId || createList.isPending) return;

    const id = await createList.mutateAsync({
      workspaceId,
      uid: userId,
      title,
    });

    setNewListTitle("");
    setSelectedListId(id);
  };

  const handleSelectList = (listId: string) => {
    if (editingListId === listId || confirmDeleteId === listId) return;
    setSelectedListId(listId);
  };

  const startEditList = (list: GoalListDoc) => {
    setEditingListId(list.id);
    setEditingTitle(list.title);
    setConfirmDeleteId(null);
  };

  const cancelEditList = () => {
    setEditingListId(null);
    setEditingTitle("");
  };

  const saveEditList = async () => {
    if (!workspaceId || !editingListId || updateList.isPending) return;

    const title = editingTitle.trim();
    if (!title) return;

    await updateList.mutateAsync({
      workspaceId,
      listId: editingListId,
      title,
    });

    cancelEditList();
  };

  const requestDeleteList = (listId: string) => {
    setConfirmDeleteId(listId);

    if (editingListId === listId) {
      cancelEditList();
    }
  };

  const cancelDeleteList = () => setConfirmDeleteId(null);

  const confirmDeleteList = async (listId: string) => {
    if (!workspaceId || deleteList.isPending) return;

    await deleteList.mutateAsync({
      workspaceId,
      listId,
    });

    if (confirmDeleteId === listId) {
      setConfirmDeleteId(null);
    }
  };

  const isUpdatingList = (listId: string) =>
    updateList.isPending && updateList.variables?.listId === listId;

  const isDeletingList = (listId: string) =>
    deleteList.isPending && deleteList.variables?.listId === listId;

  return {
    lists,
    loading,
    error,
    selectedListId,
    selectedList,
    newListTitle,
    editingListId,
    editingTitle,
    confirmDeleteId,
    createListPending: createList.isPending,
    setNewListTitle,
    setSelectedListId: handleSelectList,
    setEditingTitle,
    handleCreateList,
    startEditList,
    cancelEditList,
    saveEditList,
    requestDeleteList,
    cancelDeleteList,
    confirmDeleteList,
    isUpdatingList,
    isDeletingList,
  };
}

export type ListsSectionController = ReturnType<typeof useListsSection>;
