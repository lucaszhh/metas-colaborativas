import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isEditing) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(workspace.id);
    }
  };

  return (
    <>
      <div
        className={cn(
          "rounded-md border p-3 transition-colors",
          "cursor-pointer hover:border-accent hover:bg-accent/40",
          "focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
          isActive && "border-primary bg-primary/5 hover:bg-primary/10"
        )}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(workspace.id)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <Typography variant="small" as="p" className="truncate">
              {workspace.name}
            </Typography>
          </div>

          <EntityActionsMenu
            onEdit={() => onStartEdit(workspace)}
            onDelete={() => onConfirmDelete(workspace.id)}
            deleteTitle="Eliminar workspace"
            deleteDescription="Esta acción eliminará el workspace y no se puede deshacer."
            triggerLabel={`Abrir acciones de ${workspace.name}`}
            deletePending={isDeleting}
          />
        </div>
      </div>

      <Modal
        title="Editar workspace"
        description="Actualizá el nombre del workspace."
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) onCancelEdit();
        }}
      >
        <div className="space-y-3">
          <Input
            value={editingName}
            onChange={(event) => onEditingNameChange(event.target.value)}
            placeholder="Nombre del workspace"
            disabled={isUpdating}
          />
        </div>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isUpdating}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={onSaveEdit} disabled={isUpdating}>
            {isUpdating ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </Modal>
    </>
  );
}
