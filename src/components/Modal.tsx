import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Children, isValidElement, type ReactNode } from "react"


type ModalProps = {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: () => void
  children?: ReactNode
}

export const Modal = ({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  children,
}: ModalProps) => {
  const hasCustomFooter = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === DialogFooter
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>
            {description}
          </DialogDescription>}
        </DialogHeader>
        {children}
        {!hasCustomFooter && (
          <DialogFooter>
            {onSubmit && <Button onClick={onSubmit}>Confirmar</Button>}
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
