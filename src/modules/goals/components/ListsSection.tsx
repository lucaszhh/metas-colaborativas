import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { ErrorBanner } from "@/modules/goals/components/ErrorBanner";
import { GoalListsPanel } from "@/modules/goals/components/GoalListsPanel";
import type { ListsSectionController } from "@/modules/goals/hooks/useListsSection";

type ListsSectionProps = {
  workspaceId: string | null;
  controller: ListsSectionController;
};

export function ListsSection({ workspaceId, controller }: ListsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <Typography variant="h3">Listas</Typography>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Nueva lista"
            value={controller.newListTitle}
            onChange={(event) => controller.setNewListTitle(event.target.value)}
            disabled={!workspaceId || controller.createListPending}
          />
          <Button
            onClick={controller.handleCreateList}
            disabled={!workspaceId || controller.createListPending}
          >
            {controller.createListPending && <Loader2 className="animate-spin" />}
            {controller.createListPending ? "Creando..." : "Crear"}
          </Button>
        </div>

        {controller.error && <ErrorBanner message="No se pudieron cargar las listas." />}

        <ScrollArea className="h-105 pr-2">
          <GoalListsPanel workspaceId={workspaceId} controller={controller} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
