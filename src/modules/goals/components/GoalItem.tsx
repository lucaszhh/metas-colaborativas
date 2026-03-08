import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GoalDoc, GoalStatus } from "@/services/goals";

type GoalItemProps = {
  goal: GoalDoc;
  isEditing: boolean;
  isUpdatingStatus: boolean;
  isUpdatingGoal: boolean;
  isDeletingGoal: boolean;
  isConfirmingDelete: boolean;
  editingTitle: string;
  editingDescription: string;
  onToggleStatus: (goalId: string, status: GoalStatus) => void;
  onStartEdit: (goal: GoalDoc) => void;
  onEditingTitleChange: (title: string) => void;
  onEditingDescriptionChange: (description: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onRequestDelete: (goalId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (goalId: string) => void | Promise<void>;
};

export function GoalItem(props: GoalItemProps) {
  const {
    goal,
    isEditing,
    isUpdatingStatus,
    isUpdatingGoal,
    isDeletingGoal,
    isConfirmingDelete,
    editingTitle,
    editingDescription,
    onToggleStatus,
    onStartEdit,
    onEditingTitleChange,
    onEditingDescriptionChange,
    onSaveEdit,
    onCancelEdit,
    onRequestDelete,
    onCancelDelete,
    onConfirmDelete,
  } = props;

  const isClosed = goal.status === "close";

  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isClosed}
          onChange={() => onToggleStatus(goal.id, isClosed ? "open" : "close")}
          disabled={isUpdatingStatus || isEditing || isConfirmingDelete}
          className="h-4 w-4 accent-primary"
        />
        <span className={isClosed ? "line-through text-muted-foreground" : ""}>{goal.title}</span>

        {!isEditing && !isConfirmingDelete && (
          <div className="ml-auto flex gap-2">
            <Button size="xs" variant="outline" onClick={() => onStartEdit(goal)}>
              Editar
            </Button>
            <Button size="xs" variant="destructive" onClick={() => onRequestDelete(goal.id)}>
              Eliminar
            </Button>
          </div>
        )}
      </div>

      {!isEditing && goal.description && (
        <p className="text-xs text-muted-foreground">{goal.description}</p>
      )}

      {isConfirmingDelete && (
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="destructive"
            onClick={() => onConfirmDelete(goal.id)}
            disabled={isDeletingGoal}
          >
            {isDeletingGoal ? "Eliminando..." : "Confirmar"}
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
            placeholder="Título"
            disabled={isUpdatingGoal}
          />
          <Textarea
            value={editingDescription}
            onChange={(event) => onEditingDescriptionChange(event.target.value)}
            placeholder="Descripción"
            disabled={isUpdatingGoal}
          />
          <div className="flex items-center gap-2">
            <Button size="xs" onClick={onSaveEdit} disabled={isUpdatingGoal}>
              {isUpdatingGoal ? "Guardando..." : "Guardar"}
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
