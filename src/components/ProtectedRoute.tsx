import { Navigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("admin_token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
