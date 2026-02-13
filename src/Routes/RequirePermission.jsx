// Routes/RequirePermission.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Store/AuthStore";

export default function RequirePermission({ permissions = [], children }) {
  const { permissions: userPermissions } = useAuth();
  const location = useLocation();

  if (!permissions?.length || permissions[0] === "*") {
    return children;
  }

  const allowed = permissions.some((p) => userPermissions?.includes(p));

  if (!allowed) {
    return <Navigate to="/403" state={{ from: location }} replace />;
  }

  return children;
}
