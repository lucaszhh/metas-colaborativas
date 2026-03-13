import { useActiveScope } from "@/modules/scopes/hooks/useActiveScope";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { DashboardSkeleton } from "@/modules/goals/components/DashboardSkeleton";
import { GoalSection } from "@/modules/goals/components/GoalSection";
import { RolesSection } from "@/modules/goals/components/RolesSection";
import { useGoalsSection } from "@/modules/goals/hooks/useGoalsSection";
import { useRolesSection } from "@/modules/goals/hooks/useRolesSection";

export function Dashboard() {
  const { user, scopeId, loading } = useActiveScope();
  const rolesSection = useRolesSection({
    scopeId,
    userId: user?.uid ?? null,
  });
  const goalsSection = useGoalsSection({
    scopeId,
    roleId: rolesSection.selectedRoleId,
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
        <RolesSection scopeId={scopeId} controller={rolesSection} />
        <GoalSection
          scopeId={scopeId}
          selectedRole={rolesSection.selectedRole}
          controller={goalsSection}
        />
      </div>
    </div>
  );
}
