import { useState } from "react";
import { WorkspaceSection } from "@/modules/workspaces/components/WorkspaceSection";
import { useWorkspaceSection } from "@/modules/workspaces/hooks/useWorkspaceSection";
import { useActiveWorkspace } from "../hooks/useActiveWorkspace";
import { ModalNewWorkspace } from "./ModalNewWorkspace";

type SidebarWorkspacesProps = {
  onSelectWorkspace?: () => void;
};

export const SidebarWorkspaces = ({ onSelectWorkspace }: SidebarWorkspacesProps) => {
  const { user, workspaces, workspaceId, setActiveWorkspaceId, error, loading } =
    useActiveWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const controller = useWorkspaceSection({
    userId: user?.uid ?? null,
    workspaces,
    workspaceId,
    setActiveWorkspaceId,
  });

  return (
    <>
      <WorkspaceSection
        loading={loading}
        error={error}
        onOpenCreateWorkspace={() => setIsModalOpen(true)}
        onSelectWorkspace={onSelectWorkspace}
        controller={controller}
      />

      <ModalNewWorkspace isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};
