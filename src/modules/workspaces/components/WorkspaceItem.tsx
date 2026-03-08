import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WorkspaceSummary } from "@/services/workspaces.queries";

type WorkspaceItemProps = {
  workspace: WorkspaceSummary;
  isActive: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isConfirmingDelete: boolean;
  editingName: string;
  onSelect: (workspaceId: string) => void;
  onStartEdit: (workspace: WorkspaceSummary) => void;
  onEditingNameChange: (name: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onRequestDelete: (workspaceId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (workspaceId: string) => void | Promise<void>;
};

export function WorkspaceItem(props: WorkspaceItemProps) {
  const {
    workspace,
    isActive,
    isEditing,
    isUpdating,
    isDeleting,
    isConfirmingDelete,
    editingName,
    onSelect,
    onStartEdit,
    onEditingNameChange,
    onSaveEdit,
    onCancelEdit,
    onRequestDelete,
    onCancelDelete,
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
          disabled={isEditing || isConfirmingDelete}
        >
          {workspace.name}
        </button>

        {!isEditing && !isConfirmingDelete && (
          <div className="ml-auto flex gap-2">
            <Button size="xs" variant="outline" onClick={() => onStartEdit(workspace)}>
              Editar
            </Button>
            <Button
              size="xs"
              variant="destructive"
              onClick={() => onRequestDelete(workspace.id)}
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>

      {isConfirmingDelete && (
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="destructive"
            onClick={() => onConfirmDelete(workspace.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Confirmar"}
          </Button>
          <Button size="xs" variant="ghost" onClick={onCancelDelete}>
            Cancelar
          </Button>
        </div>
      )}

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
