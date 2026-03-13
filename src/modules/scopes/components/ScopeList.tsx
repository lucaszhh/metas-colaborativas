import { ScopeItem } from "@/modules/scopes/components/ScopeItem";
import type { ScopeSectionController } from "@/modules/scopes/hooks/useScopeSection";

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

type ScopeListProps = {
  loading: boolean;
  scopesEmpty: boolean;
  onSelectScope?: () => void;
  controller: ScopeSectionController;
};

export function ScopeList(props: ScopeListProps) {
  const { loading, scopesEmpty, onSelectScope, controller } = props;

  return (
    <section className="flex flex-col gap-2">
      {loading && (
        <>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </>
      )}

      {!loading &&
        controller.scopes.map((scope) => (
          <ScopeItem
            key={scope.id}
            scope={scope}
            isActive={scope.id === controller.scopeId}
            isEditing={controller.editingScopeId === scope.id}
            isUpdating={controller.isUpdatingScope(scope.id)}
            isDeleting={controller.isDeletingScope(scope.id)}
            editingName={controller.editingName}
            onSelect={(scopeId) => {
              controller.handleSelectScope(scopeId);
              onSelectScope?.();
            }}
            onStartEdit={controller.startEditScope}
            onEditingNameChange={controller.setEditingName}
            onSaveEdit={controller.saveEditScope}
            onCancelEdit={controller.cancelEditScope}
            onConfirmDelete={controller.confirmDeleteScope}
          />
        ))}

      {!loading && scopesEmpty && (
        <div className="text-xs text-muted-foreground">
          Todavia no tenes ambitos. Crea el primero.
        </div>
      )}
    </section>
  );
}
