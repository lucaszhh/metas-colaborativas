import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "@/auth/actions";
import { useSession } from "@/auth/useSession";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [loading, user, navigate]);

  const handleLogin = async () => {
    await loginWithGoogle();
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 rounded bg-black text-white"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
