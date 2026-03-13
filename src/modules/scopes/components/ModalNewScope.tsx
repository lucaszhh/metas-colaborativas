import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useActiveScope } from "../hooks/useActiveScope"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

type ModalNewScopeProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const ModalNewScope = ({ isOpen, setIsOpen }: ModalNewScopeProps) => {
  const {
    createAndSelectScope,
    creatingScope,
  } = useActiveScope();
  const [newScopeName, setNewScopeName] = useState("");

  useEffect(() => {
    if (!isOpen) setNewScopeName("");
  }, [isOpen]);

  const handleCreateScope = async () => {
    const name = newScopeName.trim();
    if (!name || creatingScope) return;

    try {
      await createAndSelectScope(name);
      setIsOpen(false);
      setNewScopeName("");
    } catch {
      // error is surfaced by the hook
    }
  };

  const isCreateDisabled = creatingScope || newScopeName.trim().length === 0;

  return (
    <Modal title="Nuevo ambito" open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-3">
        <Input
          placeholder="Nombre del ambito"
          value={newScopeName}
          onChange={(e) => setNewScopeName(e.target.value)}
          disabled={creatingScope}
        />
      </div>
      <DialogFooter className="pt-2">
        <DialogClose asChild>
          <Button variant="destructive">Cancelar</Button>
        </DialogClose>
        <Button onClick={handleCreateScope} disabled={isCreateDisabled}>
          {creatingScope && <Loader2 className="animate-spin" />}
          {creatingScope ? "Creando..." : "Crear"}
        </Button>
      </DialogFooter>
    </Modal>
  )
}
