// Routes/ProtectedRoutes.js

import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL, ROOT_PATH, SSO_SIGNING_PATH } from "../Services/Config";
import { useEffect, useState } from "react";
import axios from "axios";
import { localStorageGetter, localStorageSetter } from "../Utils/LocalStorage";
import { useAuth, useAuthActions } from "../Store/AuthStore";
import { CircularProgress } from "@mui/joy";
import { canAccessRoute } from "../Utils/routeUtils";

function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionValidation } = useAuthActions();
  const { isAuthenticated, permissions } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const initialize = () => {
      // Allow SSO signing route
      if (location.pathname.includes(SSO_SIGNING_PATH)) {
        setIsVerifying(false);
        return;
      }

      // Already authenticated
      if (isAuthenticated && permissions?.length > 0) {
        setIsVerifying(false);
        return;
      }

      // Validate existing session
      sessionValidation(null, (status) => {
        if (!(status >= 200 && status < 300)) {
          // ❗ NO USER / INVALID SESSION → SIGN IN
          navigate(ROOT_PATH, { replace: true });
          return;
        }
      });
    };

    initialize();

    return () => cancelToken.cancel();
  }, []);

  // Permissions + route access check
  useEffect(() => {
    if (isAuthenticated && permissions?.length > 0) {
      if (
        location.pathname === "/" ||
        location.pathname.includes(SSO_SIGNING_PATH)
      ) {
        setIsVerifying(false);
        return;
      }

      const hasAccess = canAccessRoute(location.pathname, permissions);

      if (!hasAccess) {
        const lastPath = localStorageGetter("path");
        navigate(lastPath || "/dashboard", { replace: true });
        return;
      }

      localStorageSetter("path", location.pathname);
      setIsVerifying(false);
    }
  }, [isAuthenticated, permissions, location.pathname]);

  // Root redirect
  useEffect(() => {
    if (!isVerifying && isAuthenticated && permissions?.length > 0) {
      if (location.pathname === "/") {
        const lastPath = localStorageGetter("path");
        navigate(lastPath || "/dashboard", { replace: true });
      }
    }
  }, [isVerifying, isAuthenticated, permissions, location.pathname]);

  // 🔴 FINAL GUARD: no user data → sign in
  useEffect(() => {
    if (!isVerifying && !isAuthenticated) {
      navigate(ROOT_PATH, { replace: true });
    }
  }, [isVerifying, isAuthenticated]);

  if (isVerifying) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return children;
}

export default ProtectedRoutes;
