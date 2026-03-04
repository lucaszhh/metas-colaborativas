import { logout } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarWorkspaces } from "@/modules/workspaces/components/SidebarWorkspaces";

export const Sidebar = () => {

  return (
    <aside className="sticky top-0 h-screen w-64 border-r p-4 flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Metas Colaborativas</div>
        <Separator />
        <SidebarWorkspaces />
      </div>

      <Button onClick={logout} variant="destructive">
        Cerrar sesión
      </Button>
    </aside>
  )
}