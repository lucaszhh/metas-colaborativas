import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || deletePending) return;
    await onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="ml-auto shrink-0"
            aria-label={triggerLabel}
            disabled={disabled}
          >
            <MoreHorizontal />
            <span className="sr-only">{triggerLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onSelect={onEdit} disabled={editDisabled}>
              {editLabel}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                setDeleteDialogOpen(true);
              }}
              disabled={deleteDisabled || deletePending}
            >
              {deleteLabel}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePending}>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deletePending}>
              {deletePending ? "Eliminando..." : confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
