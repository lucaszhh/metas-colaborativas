import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import type { GoalDoc, GoalStatus } from "@/services/goals";

type GoalItemProps = {
  goal: GoalDoc;
  isEditing: boolean;
  isUpdatingStatus: boolean;
  isUpdatingGoal: boolean;
  isDeletingGoal: boolean;
  editingTitle: string;
  editingDescription: string;
  onToggleStatus: (goalId: string, status: GoalStatus) => void;
  onStartEdit: (goal: GoalDoc) => void;
  onEditingTitleChange: (title: string) => void;
  onEditingDescriptionChange: (description: string) => void;
  onSaveEdit: () => void | Promise<void>;
  onCancelEdit: () => void;
  onConfirmDelete: (goalId: string) => void | Promise<void>;
};

export function GoalItem(props: GoalItemProps) {
  const {
    goal,
    isEditing,
    isUpdatingStatus,
    isUpdatingGoal,
    isDeletingGoal,
    editingTitle,
    editingDescription,
    onToggleStatus,
    onStartEdit,
    onEditingTitleChange,
    onEditingDescriptionChange,
    onSaveEdit,
    onCancelEdit,
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
          disabled={isUpdatingStatus || isEditing}
          className="h-4 w-4 accent-primary"
        />
        <Typography
          variant="small"
          as="span"
          className={isClosed ? "line-through text-muted-foreground" : ""}
        >
          {goal.title}
        </Typography>

        {!isEditing && (
          <EntityActionsMenu
            onEdit={() => onStartEdit(goal)}
            onDelete={() => onConfirmDelete(goal.id)}
            deleteTitle="Eliminar meta"
            deleteDescription="Esta acción eliminará la meta de forma permanente."
            triggerLabel={`Abrir acciones de ${goal.title}`}
            deletePending={isDeletingGoal}
          />
        )}
      </div>

      {!isEditing && goal.description && (
        <Typography variant="muted" className="text-xs">
          {goal.description}
        </Typography>
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
