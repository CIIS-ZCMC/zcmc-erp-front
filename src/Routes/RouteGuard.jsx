// Routes/RouteGuard.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/AuthStore";
import { localStorageGetter } from "../Utils/LocalStorage";

const RouteGuard = ({ permissions, children }) => {
  const { permissions: userPermissions, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  if (!permissions || permissions.length === 0) return children;

  const allowed =
    Array.isArray(userPermissions) &&
    permissions.some((p) => userPermissions.includes(p));

  if (!allowed) {
    const lastPath = localStorageGetter("path") || "/"; // fallback if no path stored
    return (
      <Navigate to={lastPath} replace state={{ from: location.pathname }} />
    );
  }

  return children;
};

export default RouteGuard;
