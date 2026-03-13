import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ScopeSummary } from "@/services/scopes.queries";

type ScopeItemProps = {
  scope: ScopeSummary;
  isActive: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  editingName: string;
  onSelect: (scopeId: string) => void;
  onStartEdit: (scope: ScopeSummary) => void;
  onEditingNameChange: (name: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onConfirmDelete: (scopeId: string) => void | Promise<void>;
};

export function ScopeItem(props: ScopeItemProps) {
  const {
    scope,
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
      onSelect(scope.id);
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
        onClick={() => onSelect(scope.id)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <Typography variant="small" as="p" className="truncate">
              {scope.name}
            </Typography>
          </div>

          <EntityActionsMenu
            onEdit={() => onStartEdit(scope)}
            onDelete={() => onConfirmDelete(scope.id)}
            deleteTitle="Eliminar ambito"
            deleteDescription="Esta accion eliminara el ambito y no se puede deshacer."
            triggerLabel={`Abrir acciones de ${scope.name}`}
            deletePending={isDeleting}
          />
        </div>
      </div>

      <Modal
        title="Editar ambito"
        description="Actualiza el nombre del ambito."
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) onCancelEdit();
        }}
      >
        <div className="space-y-3">
          <Input
            value={editingName}
            onChange={(event) => onEditingNameChange(event.target.value)}
            placeholder="Nombre del ambito"
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
