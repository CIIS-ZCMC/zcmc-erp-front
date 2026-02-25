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
      // Handle SSO signing path
      if (location.pathname.includes(SSO_SIGNING_PATH)) {
        const regenerateSigningSessionURL = `${location.pathname}${location.search}`;
        navigate(regenerateSigningSessionURL);
        return;
      }

      // If already authenticated and have permissions, we're done
      if (isAuthenticated && permissions?.length > 0) {
        setIsVerifying(false);
        return;
      }

      // Validate session
      sessionValidation(null, (status) => {
        if (!(status >= 200 && status < 300)) {
          window.location.href = BASE_URL.umis_landing_page;
          return;
        }
      });
    };

    initialize();

    return () => cancelToken.cancel();
  }, []);

  // Watch for permissions to be loaded AND check route access
  useEffect(() => {
    if (isAuthenticated && permissions?.length > 0) {
      // Skip permission check for root and signing paths
      if (
        location.pathname === "/" ||
        location.pathname.includes(SSO_SIGNING_PATH)
      ) {
        setIsVerifying(false);
        return;
      }

      // Check if user has permission for current path
      const hasAccess = canAccessRoute(location.pathname, permissions);

      if (!hasAccess) {
        // Get the last valid path they were on
        const lastPath = localStorageGetter("path");

        // Redirect back to where they were
        if (lastPath && lastPath !== location.pathname) {
          navigate(lastPath, { replace: true });
        } else {
          // If no last path or it's the same, go to dashboard
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      // If access granted, save this path as the last valid path
      localStorageSetter("path", location.pathname);
      setIsVerifying(false);
    }
  }, [isAuthenticated, permissions, location.pathname]);

  // Handle root path redirect
  useEffect(() => {
    if (!isVerifying && isAuthenticated && permissions?.length > 0) {
      if (location.pathname === "/") {
        const lastPath = localStorageGetter("path");
        navigate(lastPath || "/dashboard", { replace: true });
      }
    }
  }, [isVerifying, isAuthenticated, permissions, location.pathname]);

  // Show loading while verifying
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

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default ProtectedRoutes;
