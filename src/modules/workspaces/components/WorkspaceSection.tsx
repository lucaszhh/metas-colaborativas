import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceList } from "@/modules/workspaces/components/WorkspaceList";
import type { WorkspaceSectionController } from "@/modules/workspaces/hooks/useWorkspaceSection";

type WorkspaceSectionProps = {
  loading: boolean;
  error: unknown;
  onOpenCreateWorkspace: () => void;
  onSelectWorkspace?: () => void;
  controller: WorkspaceSectionController;
};

export function WorkspaceSection(props: WorkspaceSectionProps) {
  const { loading, error, onOpenCreateWorkspace, onSelectWorkspace, controller } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between font-bold">
        Workspaces
        <Button
          onClick={onOpenCreateWorkspace}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <Plus />
          Nuevo
        </Button>
      </div>

      {!!error && (
        <div className="text-xs text-destructive">No se pudieron cargar tus workspaces.</div>
      )}

      <WorkspaceList
        loading={loading}
        workspacesEmpty={controller.workspaces.length === 0}
        onSelectWorkspace={onSelectWorkspace}
        controller={controller}
      />
    </div>
  );
}
