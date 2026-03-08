import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
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
  editingTitle: string;
  onSelect: (listId: string) => void;
  onStartEdit: (list: GoalListDoc) => void;
  onEditingTitleChange: (title: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onConfirmDelete: (listId: string) => void | Promise<void>;
};

export function GoalListItem(props: GoalListItemProps) {
  const {
    list,
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
          disabled={isEditing}
        >
          <Typography variant="small" as="span">
            {list.title}
          </Typography>
        </button>

        {!isEditing && (
          <EntityActionsMenu
            onEdit={() => onStartEdit(list)}
            onDelete={() => onConfirmDelete(list.id)}
            deleteTitle="Eliminar lista"
            deleteDescription="Esta acción eliminará la lista seleccionada y sus metas asociadas. Confirmá que querés continuar."
            triggerLabel={`Abrir acciones de ${list.title}`}
            deletePending={isDeleting}
          />
        )}
      </div>

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
