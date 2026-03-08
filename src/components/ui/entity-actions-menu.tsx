import { useState } from "react";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EntityActionsMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
  editLabel?: string;
  deleteLabel?: string;
  deleteTitle: string;
  deleteDescription: string;
  confirmLabel?: string;
  cancelLabel?: string;
  triggerLabel?: string;
  disabled?: boolean;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  deletePending?: boolean;
};

export function EntityActionsMenu({
  onEdit,
  onDelete,
  editLabel = "Editar",
  deleteLabel = "Eliminar",
  deleteTitle,
  deleteDescription,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  triggerLabel = "Abrir acciones",
  disabled = false,
  editDisabled = false,
  deleteDisabled = false,
  deletePending = false,
}: EntityActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const closeMenuAndRun = (callback: () => void) => {
    setMenuOpen(false);
    requestAnimationFrame(callback);
  };

  const handleDelete = async () => {
    if (!onDelete || deletePending) return;
    await onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="ml-auto shrink-0"
            aria-label={triggerLabel}
            disabled={disabled}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <MoreHorizontal />
            <span className="sr-only">{triggerLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                closeMenuAndRun(onEdit);
              }}
              disabled={editDisabled}
            >
              <SquarePen />
              {editLabel}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                closeMenuAndRun(() => setDeleteDialogOpen(true));
              }}
              disabled={deleteDisabled || deletePending}
            >
              <Trash2 />
              {deleteLabel}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        title={deleteTitle}
        description={deleteDescription}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={deletePending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={deletePending}>
            {deletePending ? "Eliminando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </Modal>
    </>
  );
}
