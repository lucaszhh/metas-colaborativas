import { Outlet } from "react-router-dom";
import { logout } from "@/auth/actions";

export function AppLayout() {
  return (
    <div className="h-screen flex">
      <aside className="w-64 border-r p-4">
        <div className="font-bold mb-4">Mi App</div>
        <button onClick={logout} className="text-sm text-red-500">
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
