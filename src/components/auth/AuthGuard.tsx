import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: redirectTo });
    }
  }, [session, isPending, navigate, redirectTo]);

  if (isPending) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
