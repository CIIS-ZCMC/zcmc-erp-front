import { useEffect } from "react";
import { useAuthActions } from "../Store/AuthStore";
import erp_api from "@Services/ERP_API";
import useSnackbarHook from "./SnackbarHook";

export const useSessionTimeout = (enabled = false) => {
  const { logout } = useAuthActions();
  const { showSnack } = useSnackbarHook();

  useEffect(() => {
    if (!enabled) return;

    let loggingOut = false;

    const checkSession = async () => {
      try {
        if (loggingOut) return;

        const response = await erp_api.get("session_exp");

        const { session_expire, token_expiration } = response.data;

        const expiryTime = new Date(token_expiration).getTime();
        const remaining = expiryTime - Date.now();

        if (remaining <= 10 * 60 * 1000 && remaining > 0) {
          showSnack(
            500,
            "Your session will expire soon. Please save your work.",
          );
        }

        if (session_expire) {
          loggingOut = true;

          showSnack(500, "Your session has expired. Redirecting to login...");

          setTimeout(() => {
            logout();
          }, 5000);
        }
      } catch (error) {
        console.error("Session check failed:", error);

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 419
        ) {
          loggingOut = true;

          showSnack(500, "Your session has expired. Redirecting to login...");

          setTimeout(() => {
            logout();
          }, 5000);
        }
      }
    };

    checkSession();

    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout, showSnack, enabled]);

  return null;
};
