import { Outlet } from "react-router-dom"
import { useState } from "react"
import { AppHeader } from "@/modules/core/components/AppHeader"
import { ResponsiveSidebar } from "@/modules/core/components/ResponsiveSidebar"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <ResponsiveSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
