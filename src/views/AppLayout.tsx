import { Outlet } from "react-router-dom";
import { Sidebar } from "@/modules/core/components/Sidebar";

export function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
