// App.js

import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL, ENV, ROOT_PATH, SSO_SIGNING_PATH } from "../Services/Config";
import { useEffect } from "react";
import axios from "axios";
import { localStorageGetter } from "../Utils/LocalStorage";
import { useAuth, useAuthActions } from "../Store/AuthStore";

function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionValidation } = useAuthActions();
  const { permissions } = useAuth();
  // const [loading, setLoading] = useState(true);

  function initialize() {
    if (location.pathname.includes(SSO_SIGNING_PATH)) {
      const regenerateSigningSessionURL = `${location.pathname}${location.search}`;
      navigate(regenerateSigningSessionURL);
      return;
    }

    sessionValidation(null, (status) => {
      if (!(status >= 200 && status < 300)) {
        window.location.href = BASE_URL[ENV];

        // setLoading(false);
        return;
      }
      if (status === 200) {
        const lastPath = localStorageGetter("path");

        // --- SAFELY CHECK PERMISSION ---
        const hasApproval =
          Array.isArray(permissions) &&
          permissions.includes("ERP-AOP-MAN:approval");

        // --- When no redirect history exists ---
        if (!lastPath) {
          // If user does NOT have approval permission → redirect to /aop
          if (!hasApproval) {
            return navigate("/aop");
          }

          // Otherwise go to ROOT_PATH (/dashboard)
          return navigate(ROOT_PATH);
        }

        // --- If lastPath exists ---
        return navigate(lastPath ?? ROOT_PATH);
      }

      // if (!localStorageGetter("path")) {
      //   // setLoading(false);
      //   return navigate(ROOT_PATH);
      // }
      // // setLoading(false);
      // return navigate(localStorageGetter("path") ?? ROOT_PATH);

      // setLoading(false);
    });
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    initialize();

    return () => cancelToken.cancel();
  }, []);

  return children;
}

export default ProtectedRoutes;
