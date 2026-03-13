import { useState } from "react";
import { ScopeSection } from "@/modules/scopes/components/ScopeSection";
import { useScopeSection } from "@/modules/scopes/hooks/useScopeSection";
import { useActiveScope } from "../hooks/useActiveScope";
import { ModalNewScope } from "./ModalNewScope";

type SidebarScopesProps = {
  onSelectScope?: () => void;
};

export const SidebarScopes = ({ onSelectScope }: SidebarScopesProps) => {
  const { user, scopes, scopeId, setActiveScopeId, error, loading } =
    useActiveScope();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const controller = useScopeSection({
    userId: user?.uid ?? null,
    scopes,
    scopeId,
    setActiveScopeId,
  });

  return (
    <>
      <ScopeSection
        loading={loading}
        error={error}
        onOpenCreateScope={() => setIsModalOpen(true)}
        onSelectScope={onSelectScope}
        controller={controller}
      />

      <ModalNewScope isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};
