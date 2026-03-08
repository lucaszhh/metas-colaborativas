import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { GoalListDoc } from "@/services/goals";

type GoalListItemProps = {
  list: GoalListDoc;
  isSelected: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isConfirmingDelete: boolean;
  editingTitle: string;
  onSelect: (listId: string) => void;
  onStartEdit: (list: GoalListDoc) => void;
  onEditingTitleChange: (title: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onRequestDelete: (listId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (listId: string) => void | Promise<void>;
};

export function GoalListItem(props: GoalListItemProps) {
  const {
    list,
    isSelected,
    isEditing,
    isUpdating,
    isDeleting,
    isConfirmingDelete,
    editingTitle,
    onSelect,
    onStartEdit,
    onEditingTitleChange,
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
        isSelected && "border-primary bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex-1 text-left text-sm font-medium"
          onClick={() => onSelect(list.id)}
          disabled={isEditing || isConfirmingDelete}
        >
          <Typography variant="small" as="span">
            {list.title}
          </Typography>
        </button>

        {!isEditing && !isConfirmingDelete && (
          <div className="ml-auto flex gap-2">
            <Button size="xs" variant="outline" onClick={() => onStartEdit(list)}>
              Editar
            </Button>
            <Button size="xs" variant="destructive" onClick={() => onRequestDelete(list.id)}>
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
            onClick={() => onConfirmDelete(list.id)}
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
            value={editingTitle}
            onChange={(event) => onEditingTitleChange(event.target.value)}
            placeholder="Nombre de la lista"
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
