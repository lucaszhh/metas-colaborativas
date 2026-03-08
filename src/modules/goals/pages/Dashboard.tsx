import { useActiveWorkspace } from "@/modules/workspaces/hooks/useActiveWorkspace";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { DashboardSkeleton } from "@/modules/goals/components/DashboardSkeleton";
import { GoalSection } from "@/modules/goals/components/GoalSection";
import { ListsSection } from "@/modules/goals/components/ListsSection";
import { useGoalsSection } from "@/modules/goals/hooks/useGoalsSection";
import { useListsSection } from "@/modules/goals/hooks/useListsSection";

export function Dashboard() {
  const { user, workspaceId, loading } = useActiveWorkspace();
  const listsSection = useListsSection({
    workspaceId,
    userId: user?.uid ?? null,
  });
  const goalsSection = useGoalsSection({
    workspaceId,
    listId: listsSection.selectedListId,
    userId: user?.uid ?? null,
  });

  if (loading) return <DashboardSkeleton />;
  if (!user) return <div className="p-6">Sin sesión</div>;

  return (
    <div className="space-y-4">
      <div>
        <Typography variant="h1" className="text-2xl">
          Dashboard
        </Typography>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ListsSection workspaceId={workspaceId} controller={listsSection} />
        <GoalSection
          workspaceId={workspaceId}
          selectedList={listsSection.selectedList}
          controller={goalsSection}
        />
      </div>
    </div>
  );
}
