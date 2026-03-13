import type { KeyboardEvent } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { RoleDoc } from "@/services/goals";

type RoleItemProps = {
  role: RoleDoc;
  isSelected: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  editingTitle: string;
  onSelect: (roleId: string) => void;
  onStartEdit: (role: RoleDoc) => void;
  onEditingTitleChange: (title: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onConfirmDelete: (roleId: string) => void | Promise<void>;
};

export function RoleItem(props: RoleItemProps) {
  const {
    role,
    isSelected,
    isEditing,
    isUpdating,
    isDeleting,
    editingTitle,
    onSelect,
    onStartEdit,
    onEditingTitleChange,
    onSaveEdit,
    onCancelEdit,
    onConfirmDelete,
  } = props;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isEditing) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(role.id);
    }
  };

  return (
    <>
      <div
        className={cn(
          "rounded-md border p-3 transition-colors",
          "cursor-pointer hover:border-accent hover:bg-accent/40",
          "focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]",
          isSelected && "border-primary bg-primary/5 hover:bg-primary/10"
        )}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(role.id)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <Typography variant="small" as="p" className="truncate">
              {role.title}
            </Typography>
          </div>

          <EntityActionsMenu
            onEdit={() => onStartEdit(role)}
            onDelete={() => onConfirmDelete(role.id)}
            deleteTitle="Eliminar rol"
            deleteDescription="Esta accion eliminara el rol seleccionado. Confirma que queres continuar."
            triggerLabel={`Abrir acciones de ${role.title}`}
            deletePending={isDeleting}
          />
        </div>
      </div>

      <Modal
        title="Editar rol"
        description="Actualiza el nombre del rol."
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) onCancelEdit();
        }}
      >
        <div className="space-y-3">
          <Input
            value={editingTitle}
            onChange={(event) => onEditingTitleChange(event.target.value)}
            placeholder="Nombre del rol"
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
