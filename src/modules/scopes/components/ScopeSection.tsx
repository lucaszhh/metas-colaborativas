import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScopeList } from "@/modules/scopes/components/ScopeList";
import type { ScopeSectionController } from "@/modules/scopes/hooks/useScopeSection";

type ScopeSectionProps = {
  loading: boolean;
  error: unknown;
  onOpenCreateScope: () => void;
  onSelectScope?: () => void;
  controller: ScopeSectionController;
};

export function ScopeSection(props: ScopeSectionProps) {
  const { loading, error, onOpenCreateScope, onSelectScope, controller } = props;

  return (
    <div className="flex flex-col gap-4 mt-8 md:mt-0">
      <div className="flex items-center justify-between font-bold">
        Ambitos
        <Button
          onClick={onOpenCreateScope}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <Plus />
          Nuevo
        </Button>
      </div>

      {!!error && (
        <div className="text-xs text-destructive">No se pudieron cargar tus ambitos.</div>
      )}

      <ScopeList
        loading={loading}
        scopesEmpty={controller.scopes.length === 0}
        onSelectScope={onSelectScope}
        controller={controller}
      />
    </div>
  );
}
