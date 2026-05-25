import { useEffect } from "react";
import { useAuthActions } from "../Store/AuthStore";
import useSnackbarHook from "./SnackbarHook";

export const useSessionTimeout = () => {
  const { logout } = useAuthActions();
  const { showSnack } = useSnackbarHook();

  useEffect(() => {
    // Check session every 5 minutes
    const interval = setInterval(
      () => {
        try {
          const user = localStorage.getItem("user");
          if (user) {
            const userData = JSON.parse(user);
            const token = userData.token;

            // Simple token expiry check (adjust as needed)
            const tokenAge = Date.now() - (userData.timestamp || Date.now());
            const maxAge = 8 * 60 * 60 * 1000; // 8 hours

            if (tokenAge > maxAge) {
              showSnack(
                "Session will expire soon. Please save your work.",
                "warning",
                5000,
              );
              // Give user 5 seconds before logout
              setTimeout(() => {
                logout();
              }, 5000);
            }
          }
        } catch (error) {
          console.error("Session check error:", error);
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, [logout, showSnack]);

  return null;
};
