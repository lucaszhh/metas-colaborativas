import { useEffect, useMemo, useState } from "react";
import { useGoalLists } from "@/modules/goals/hooks/useGoalLists";
import { useGoalMutations } from "@/modules/goals/hooks/useGoalMutations";

type UseListsSectionParams = {
  workspaceId: string | null;
  userId: string | null;
};

export function useListsSection(params: UseListsSectionParams) {
  const { workspaceId, userId } = params;
  const { createList } = useGoalMutations();
  const { lists, loading, error } = useGoalLists(workspaceId);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState("");

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

  return {
    lists,
    loading,
    error,
    selectedListId,
    selectedList,
    newListTitle,
    createListPending: createList.isPending,
    setNewListTitle,
    setSelectedListId,
    handleCreateList,
  };
}

export type ListsSectionController = ReturnType<typeof useListsSection>;
