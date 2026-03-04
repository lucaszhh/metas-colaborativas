import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useActiveWorkspace } from "../hooks/useActiveWorkspace"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

type ModalNewWorkspaceProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const ModalNewWorkspace = ({ isOpen, setIsOpen }: ModalNewWorkspaceProps) => {
  const {
    createAndSelectWorkspace,
    creatingWorkspace,
  } = useActiveWorkspace();
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  useEffect(() => {
    if (!isOpen) setNewWorkspaceName("");
  }, [isOpen]);

  const handleCreateWorkspace = async () => {
    const name = newWorkspaceName.trim();
    if (!name || creatingWorkspace) return;

    try {
      await createAndSelectWorkspace(name);
      setIsOpen(false);
      setNewWorkspaceName("");
    } catch {
      // error is surfaced by the hook
    }
  };

  const isCreateDisabled = creatingWorkspace || newWorkspaceName.trim().length === 0;

  return (
    <Modal title="Nuevo Workspace" open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-3">
        <Input
          placeholder="Nombre del workspace"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          disabled={creatingWorkspace}
        />
      </div>
      <DialogFooter className="pt-2">
        <DialogClose asChild>
          <Button variant="destructive">Cancelar</Button>
        </DialogClose>
        <Button onClick={handleCreateWorkspace} disabled={isCreateDisabled}>
          {creatingWorkspace && <Loader2 className="animate-spin" />}
          {creatingWorkspace ? "Creando..." : "Crear"}
        </Button>
      </DialogFooter>
    </Modal>
  )
}