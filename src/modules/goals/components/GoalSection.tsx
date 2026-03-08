import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { ErrorBanner } from "@/modules/goals/components/ErrorBanner";
import { GoalItem } from "@/modules/goals/components/GoalItem";
import { GoalList } from "@/modules/goals/components/GoalList";
import type { GoalsSectionController } from "@/modules/goals/hooks/useGoalsSection";
import type { GoalListDoc } from "@/services/goals";

type GoalSectionProps = {
  workspaceId: string | null;
  selectedList: GoalListDoc | null;
  controller: GoalsSectionController;
};

export function GoalSection({ workspaceId, selectedList, controller }: GoalSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleCreateGoal = async () => {
    await controller.handleCreateGoal();
    focusInput();
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <Typography variant="h3">
          Metas{selectedList ? ` — ${selectedList.title}` : ""}
        </Typography>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Nueva meta"
            value={controller.newGoalTitle}
            onChange={(event) => controller.setNewGoalTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              void handleCreateGoal();
            }}
            disabled={!selectedList || !workspaceId || controller.createGoalPending}
          />
          <Button
            onClick={handleCreateGoal}
            disabled={!selectedList || !workspaceId || controller.createGoalPending}
          >
            {controller.createGoalPending && <Loader2 className="animate-spin" />}
            {controller.createGoalPending ? "Agregando..." : "Agregar"}
          </Button>
        </div>

        {controller.error && <ErrorBanner message="No se pudieron cargar las metas." />}

        <ScrollArea className="h-105 pr-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <GoalList
              title="Open"
              count={controller.openGoals.length}
              loading={controller.loading}
              hasSelectedList={!!selectedList}
              emptyMessage="No hay metas abiertas."
            >
              {controller.openGoals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  isEditing={controller.editingGoalId === goal.id}
                  isUpdatingStatus={controller.isUpdatingStatus(goal.id)}
                  isUpdatingGoal={controller.isUpdatingGoal(goal.id)}
                  isDeletingGoal={controller.isDeletingGoal(goal.id)}
                  editingTitle={controller.editingTitle}
                  editingDescription={controller.editingDescription}
                  onToggleStatus={controller.handleToggleGoal}
                  onStartEdit={controller.startEditGoal}
                  onEditingTitleChange={controller.setEditingTitle}
                  onEditingDescriptionChange={controller.setEditingDescription}
                  onSaveEdit={controller.saveEditGoal}
                  onCancelEdit={controller.cancelEditGoal}
                  onConfirmDelete={controller.confirmDeleteGoal}
                />
              ))}
            </GoalList>

            <GoalList
              title="Close"
              count={controller.closedGoals.length}
              loading={controller.loading}
              hasSelectedList={!!selectedList}
              emptyMessage="No hay metas cerradas."
            >
              {controller.closedGoals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  isEditing={controller.editingGoalId === goal.id}
                  isUpdatingStatus={controller.isUpdatingStatus(goal.id)}
                  isUpdatingGoal={controller.isUpdatingGoal(goal.id)}
                  isDeletingGoal={controller.isDeletingGoal(goal.id)}
                  editingTitle={controller.editingTitle}
                  editingDescription={controller.editingDescription}
                  onToggleStatus={controller.handleToggleGoal}
                  onStartEdit={controller.startEditGoal}
                  onEditingTitleChange={controller.setEditingTitle}
                  onEditingDescriptionChange={controller.setEditingDescription}
                  onSaveEdit={controller.saveEditGoal}
                  onCancelEdit={controller.cancelEditGoal}
                  onConfirmDelete={controller.confirmDeleteGoal}
                />
              ))}
            </GoalList>
          </div>

          {!workspaceId && (
            <Typography variant="muted">
              Seleccioná un workspace para ver metas.
            </Typography>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
