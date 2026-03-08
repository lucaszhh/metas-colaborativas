import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WorkspaceSummary } from "@/services/workspaces.queries";

type WorkspaceItemProps = {
  workspace: WorkspaceSummary;
  isActive: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  editingName: string;
  onSelect: (workspaceId: string) => void;
  onStartEdit: (workspace: WorkspaceSummary) => void;
  onEditingNameChange: (name: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onConfirmDelete: (workspaceId: string) => void | Promise<void>;
};

export function WorkspaceItem(props: WorkspaceItemProps) {
  const {
    workspace,
    isActive,
    isEditing,
    isUpdating,
    isDeleting,
    editingName,
    onSelect,
    onStartEdit,
    onEditingNameChange,
    onSaveEdit,
    onCancelEdit,
    onConfirmDelete,
  } = props;

  return (
    <div
      className={cn(
        "space-y-2 rounded-md border p-3 transition-colors",
        isActive && "border-primary bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex-1 text-left text-sm font-medium"
          onClick={() => onSelect(workspace.id)}
          disabled={isEditing}
        >
          {workspace.name}
        </button>

        {!isEditing && (
          <EntityActionsMenu
            onEdit={() => onStartEdit(workspace)}
            onDelete={() => onConfirmDelete(workspace.id)}
            deleteTitle="Eliminar workspace"
            deleteDescription="Esta acción eliminará el workspace y no se puede deshacer."
            triggerLabel={`Abrir acciones de ${workspace.name}`}
            deletePending={isDeleting}
          />
        )}
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Input
            value={editingName}
            onChange={(event) => onEditingNameChange(event.target.value)}
            placeholder="Nombre del workspace"
            disabled={isUpdating}
          />
          <div className="flex items-center gap-2">
            <Button size="xs" onClick={onSaveEdit} disabled={isUpdating}>
              {isUpdating ? "Guardando..." : "Guardar"}
            </Button>
            <Button size="xs" variant="ghost" onClick={onCancelEdit}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
