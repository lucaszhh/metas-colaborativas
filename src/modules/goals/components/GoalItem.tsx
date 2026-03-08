import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { EntityActionsMenu } from "@/components/ui/entity-actions-menu";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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
    <>
      <div className="space-y-2 rounded-md border p-3 transition-colors">
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
            className={isClosed ? "line-through text-muted-foreground" : "flex-1"}
          >
            {goal.title}
          </Typography>

          <EntityActionsMenu
            onEdit={() => onStartEdit(goal)}
            onDelete={() => onConfirmDelete(goal.id)}
            deleteTitle="Eliminar meta"
            deleteDescription="Esta acción eliminará la meta de forma permanente."
            triggerLabel={`Abrir acciones de ${goal.title}`}
            deletePending={isDeletingGoal}
          />
        </div>

        {goal.description && (
          <Typography variant="muted" className="text-xs">
            {goal.description}
          </Typography>
        )}
      </div>

      <Modal
        title="Editar meta"
        description="Actualizá el título y la descripción de la meta."
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) onCancelEdit();
        }}
      >
        <div className="space-y-3">
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
        </div>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isUpdatingGoal}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={onSaveEdit} disabled={isUpdatingGoal}>
            {isUpdatingGoal ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </Modal>
    </>
  );
}
