import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { Role } from "@/store/auth.store";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  allow?: Role;
  children: ReactNode;
}

export function ProtectedRoute({ allow, children }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (allow && user.role !== allow) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
