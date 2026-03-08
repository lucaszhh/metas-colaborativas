import { GoalListItem } from "@/modules/goals/components/GoalListItem";
import { Typography } from "@/components/ui/typography";
import type { ListsSectionController } from "@/modules/goals/hooks/useListsSection";

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

type GoalListsPanelProps = {
  workspaceId: string | null;
  controller: ListsSectionController;
};

export function GoalListsPanel({ workspaceId, controller }: GoalListsPanelProps) {
  return (
    <div className="space-y-2">
      {controller.loading && (
        <>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </>
      )}

      {!controller.loading &&
        controller.lists.map((list) => (
          <GoalListItem
            key={list.id}
            list={list}
            isSelected={list.id === controller.selectedListId}
            isEditing={controller.editingListId === list.id}
            isUpdating={controller.isUpdatingList(list.id)}
            isDeleting={controller.isDeletingList(list.id)}
            editingTitle={controller.editingTitle}
            onSelect={controller.setSelectedListId}
            onStartEdit={controller.startEditList}
            onEditingTitleChange={controller.setEditingTitle}
            onSaveEdit={controller.saveEditList}
            onCancelEdit={controller.cancelEditList}
            onConfirmDelete={controller.confirmDeleteList}
          />
        ))}

      {workspaceId && !controller.loading && controller.lists.length === 0 && (
        <Typography variant="muted">
          No hay listas todavía. Creá la primera.
        </Typography>
      )}

      {!workspaceId && (
        <Typography variant="muted">
          Seleccioná un workspace para ver sus listas.
        </Typography>
      )}
    </div>
  );
}
