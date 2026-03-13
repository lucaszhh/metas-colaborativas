import { RoleItem } from "@/modules/goals/components/RoleItem";
import { Typography } from "@/components/ui/typography";
import type { RolesSectionController } from "@/modules/goals/hooks/useRolesSection";

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

type RolesPanelProps = {
  scopeId: string | null;
  controller: RolesSectionController;
};

export function RolesPanel({ scopeId, controller }: RolesPanelProps) {
  return (
    <div className="space-y-2">
      {controller.loading && (
        <>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </>
      )}

      {!controller.loading &&
        controller.roles.map((role) => (
          <RoleItem
            key={role.id}
            role={role}
            isSelected={role.id === controller.selectedRoleId}
            isEditing={controller.editingRoleId === role.id}
            isUpdating={controller.isUpdatingRole(role.id)}
            isDeleting={controller.isDeletingRole(role.id)}
            editingTitle={controller.editingTitle}
            onSelect={controller.setSelectedRoleId}
            onStartEdit={controller.startEditRole}
            onEditingTitleChange={controller.setEditingTitle}
            onSaveEdit={controller.saveEditRole}
            onCancelEdit={controller.cancelEditRole}
            onConfirmDelete={controller.confirmDeleteRole}
          />
        ))}

      {scopeId && !controller.loading && controller.roles.length === 0 && (
        <Typography variant="muted">
          No hay roles todavia. Crea el primero.
        </Typography>
      )}

      {!scopeId && (
        <Typography variant="muted">
          Selecciona un ambito para ver sus roles.
        </Typography>
      )}
    </div>
  );
}
