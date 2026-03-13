import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { ErrorBanner } from "@/modules/goals/components/ErrorBanner";
import { RolesPanel } from "@/modules/goals/components/RolesPanel";
import type { RolesSectionController } from "@/modules/goals/hooks/useRolesSection";

type RolesSectionProps = {
  scopeId: string | null;
  controller: RolesSectionController;
};

export function RolesSection({ scopeId, controller }: RolesSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleCreateRole = async () => {
    await controller.handleCreateRole();
    focusInput();
  };

  return (
    <Card>
      <CardHeader>
        <Typography variant="h3">Roles</Typography>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Nuevo rol"
            value={controller.newRoleTitle}
            onChange={(event) => controller.setNewRoleTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              void handleCreateRole();
            }}
            disabled={!scopeId || controller.createRolePending}
          />
          <Button
            onClick={handleCreateRole}
            disabled={!scopeId || controller.createRolePending}
          >
            {controller.createRolePending && <Loader2 className="animate-spin" />}
            {controller.createRolePending ? "Creando..." : "Crear"}
          </Button>
        </div>

        {controller.error && <ErrorBanner message="No se pudieron cargar los roles." />}

        <ScrollArea className="h-105 pr-2">
          <RolesPanel scopeId={scopeId} controller={controller} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
