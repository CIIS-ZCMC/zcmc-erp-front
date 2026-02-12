import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/AuthStore";

export default function PermissionGuard({
  children,
  requiredPermissions = [],
  redirectTo = "/dashboard",
}) {
  const { permissions } = useAuth();

  const allowed =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((p) => permissions?.includes(p));

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
