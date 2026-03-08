import { WorkspaceItem } from "@/modules/workspaces/components/WorkspaceItem";
import type { WorkspaceSectionController } from "@/modules/workspaces/hooks/useWorkspaceSection";

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

type WorkspaceListProps = {
  loading: boolean;
  workspacesEmpty: boolean;
  onSelectWorkspace?: () => void;
  controller: WorkspaceSectionController;
};

export function WorkspaceList(props: WorkspaceListProps) {
  const { loading, workspacesEmpty, onSelectWorkspace, controller } = props;

  return (
    <section className="flex flex-col gap-2">
      {loading && (
        <>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </>
      )}

      {!loading &&
        controller.workspaces.map((workspace) => (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            isActive={workspace.id === controller.workspaceId}
            isEditing={controller.editingWorkspaceId === workspace.id}
            isUpdating={controller.isUpdatingWorkspace(workspace.id)}
            isDeleting={controller.isDeletingWorkspace(workspace.id)}
            isConfirmingDelete={controller.confirmDeleteId === workspace.id}
            editingName={controller.editingName}
            onSelect={(workspaceId) => {
              controller.handleSelectWorkspace(workspaceId);
              onSelectWorkspace?.();
            }}
            onStartEdit={controller.startEditWorkspace}
            onEditingNameChange={controller.setEditingName}
            onSaveEdit={controller.saveEditWorkspace}
            onCancelEdit={controller.cancelEditWorkspace}
            onRequestDelete={controller.requestDeleteWorkspace}
            onCancelDelete={controller.cancelDeleteWorkspace}
            onConfirmDelete={controller.confirmDeleteWorkspace}
          />
        ))}

      {!loading && workspacesEmpty && (
        <div className="text-xs text-muted-foreground">
          Todavía no tenés workspaces. Creá el primero.
        </div>
      )}
    </section>
  );
}
