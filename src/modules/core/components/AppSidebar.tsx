import { logout } from "@/modules/auth/actions"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarWorkspaces } from "@/modules/workspaces/components/SidebarWorkspaces"
import { cn } from "@/lib/utils"

type AppSidebarProps = {
  onNavigate?: () => void
  className?: string
}

export const AppSidebar = ({ onNavigate, className }: AppSidebarProps) => {
  const handleLogout = () => {
    logout()
    onNavigate?.()
  }

  return (
    <aside className={cn("h-full w-72 border-r bg-background", className)}>
      <div className="flex h-full flex-col gap-4 p-4">
        <ScrollArea className="flex-1">
          <SidebarWorkspaces onSelectWorkspace={onNavigate} />
        </ScrollArea>
        <Button onClick={handleLogout} variant="destructive">
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
