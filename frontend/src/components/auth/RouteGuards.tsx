import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: Props) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: Props) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: Props) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}