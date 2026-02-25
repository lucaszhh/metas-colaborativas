import { Navigate } from "react-router-dom";
import { useSession } from "@/auth/useSession";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();

  if (loading) return null; // después podés meter skeleton/spinner
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
