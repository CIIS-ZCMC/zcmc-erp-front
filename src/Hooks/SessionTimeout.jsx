import { useEffect, useRef } from "react";
import { useAuthActions } from "../Store/AuthStore";
import erp_api from "@Services/ERP_API";
import useSnackbarHook from "./SnackbarHook";

const WARNING_LEAD_MS = 10 * 60 * 1000;
const MAX_TIMEOUT_MS = 2147483647;

export const useSessionTimeout = (enabled = false) => {
  const { logout } = useAuthActions();
  const { showSnack } = useSnackbarHook();

  const logoutRef = useRef(logout);
  const showSnackRef = useRef(showSnack);

  useEffect(() => {
    logoutRef.current = logout;
    showSnackRef.current = showSnack;
  }, [logout, showSnack]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    let loggingOut = false;
    let warningTimer = null;
    let expiryTimer = null;
    let redirectTimer = null;

    const clearTimers = () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (expiryTimer) clearTimeout(expiryTimer);
      if (redirectTimer) clearTimeout(redirectTimer);
      warningTimer = null;
      expiryTimer = null;
      redirectTimer = null;
    };

    const triggerLogout = () => {
      if (loggingOut || !isMounted) return;
      loggingOut = true;
      clearTimers();

      showSnackRef.current(
        500,
        "Your session has expired. Redirecting to login...",
      );

      redirectTimer = setTimeout(async () => {
        const redirectTo = await logoutRef.current();
        window.location.href = redirectTo || "/";
      }, 5000);
    };

    const scheduleFromExpiration = (tokenExpiration) => {
      clearTimers();
      if (!isMounted || loggingOut || !tokenExpiration) return;

      const expiryTime = new Date(tokenExpiration).getTime();
      if (Number.isNaN(expiryTime)) return;

      const remaining = expiryTime - Date.now();
      if (remaining <= 0) {
        triggerLogout();
        return;
      }

      if (remaining <= WARNING_LEAD_MS) {
        showSnackRef.current(
          500,
          "Your session will expire soon. Please save your work.",
        );
      } else {
        const warnDelay = Math.min(remaining - WARNING_LEAD_MS, MAX_TIMEOUT_MS);
        warningTimer = setTimeout(() => {
          checkSession();
        }, warnDelay);
      }

      const expiryDelay = Math.min(remaining + 1000, MAX_TIMEOUT_MS);
      expiryTimer = setTimeout(() => {
        checkSession();
      }, expiryDelay);
    };

    const checkSession = async () => {
      try {
        if (!isMounted || loggingOut) return;

        const response = await erp_api.get("session_exp");
        const { session_expire, token_expiration } = response.data || {};

        if (session_expire) {
          triggerLogout();
          return;
        }

        scheduleFromExpiration(token_expiration);
      } catch (error) {
        console.error("Session check failed:", error);

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 419
        ) {
          triggerLogout();
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      clearTimers();
    };
  }, [enabled]);

  return null;
};
