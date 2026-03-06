import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "@/modules/auth/actions";
import { useSession } from "@/modules/auth/useSession";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="flex h-screen items-center justify-center">
      <Card className="h-40">
        <CardContent className="flex flex-col justify-between h-full">
          <h1 className="text-2xl font-bold text-center">Metas Colaborativas</h1>
          <Button onClick={handleLogin}>
            Iniciar sesión con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
