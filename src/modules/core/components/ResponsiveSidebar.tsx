import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AppSidebar } from "@/modules/core/components/AppSidebar"

type ResponsiveSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ResponsiveSidebar = ({
  open,
  onOpenChange,
}: ResponsiveSidebarProps) => {
  return (
    <>
      <div className="hidden md:block">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
          <AppSidebar />
        </div>
      </div>
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="left" className="w-72 p-0">
            <AppSidebar onNavigate={() => onOpenChange(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
