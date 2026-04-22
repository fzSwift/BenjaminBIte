import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default AdminRoute;
