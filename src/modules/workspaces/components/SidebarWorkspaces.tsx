import { Button } from "@/components/ui/button";
import { useActiveWorkspace } from "../hooks/useActiveWorkspace";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ModalNewWorkspace } from "./ModalNewWorkspace";

export const SidebarWorkspaces = () => {
  const {
    workspaces,
    workspaceId,
    setActiveWorkspaceId,
    error,
    loading,
  } = useActiveWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between font-bold">
          Workspaces
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <Plus /> Nuevo
          </Button>
        </div>

        {error && (
          <div className="text-xs text-destructive">
            No se pudieron cargar tus workspaces.
          </div>
        )}

        {loading && (
          <div className="text-xs text-muted-foreground">Cargando workspaces...</div>
        )}

        {!loading && workspaces.length === 0 && (
          <div className="text-xs text-muted-foreground">
            Todavía no tenés workspaces. Creá el primero.
          </div>
        )}

        <section className="flex flex-col gap-2">
          {!loading &&
            workspaces.map((workspace) => (
              <Button
                key={workspace.id}
                variant={workspace.id === workspaceId ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setActiveWorkspaceId(workspace.id)}
                size="sm"
              >
                {workspace.name}
              </Button>
            ))}
        </section>
      </div>

      <ModalNewWorkspace isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};
