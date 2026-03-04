import { Navigate } from "react-router-dom";
import { useSession } from "@/modules/auth/useSession";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();

  //TODO: diseñar loading state

  if (loading) return null; 
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
