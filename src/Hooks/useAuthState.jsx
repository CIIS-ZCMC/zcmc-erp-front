import { useAuth } from "../Store/AuthStore";
import { useMemo } from "react";

export const useAuthState = () => {
  const { permissions, isAuthenticated, user } = useAuth();

  return useMemo(
    () => ({
      isAuthenticated,
      hasPermissions: permissions?.length > 0,
      permissions,
      user,
      isReady: isAuthenticated && permissions?.length > 0,
    }),
    [isAuthenticated, permissions, user],
  );
};
