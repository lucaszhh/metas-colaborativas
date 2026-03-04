import type { ReactNode } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

type AppHeaderProps = {
  onMenuClick: () => void
  title?: string
  actions?: ReactNode
}

export function AppHeader({
  onMenuClick,
  title = "Metas Colaborativas",
  actions,
}: AppHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </Button>
        <div className="flex-1 font-semibold">{title}</div>
        <div className="flex items-center gap-2">
          {actions ?? <div className="w-8" />}
        </div>
      </div>
    </header>
  )
}
