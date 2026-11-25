// Routes/RouteGuard.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/AuthStore";
import { localStorageGetter } from "../Utils/LocalStorage";
import { isBudgetOfficerUser } from "../Utils/BudgetOfficerCheck";

const RouteGuard = ({ permissions, budgetOfficerOnly = false, children }) => {
  const { user, permissions: userPermissions, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  if (budgetOfficerOnly && !isBudgetOfficerUser(user)) {
    const lastPath = localStorageGetter("path") || "/";
    return (
      <Navigate to={lastPath} replace state={{ from: location.pathname }} />
    );
  }

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
