// App.js

import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL, ROOT_PATH, SSO_SIGNING_PATH } from "../Services/Config";
import { useEffect } from "react";
import axios from "axios";
import { localStorageGetter } from "../Utils/LocalStorage";
import { useAuthActions } from "../Store/AuthStore";

function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionValidation } = useAuthActions();
  // const [loading, setLoading] = useState(true);

  function initialize(token) {
    if (location.pathname.includes(SSO_SIGNING_PATH)) {
      const regenerateSigningSessionURL = `${location.pathname}${location.search}`;
      navigate(regenerateSigningSessionURL);
      return;
    }

    sessionValidation(token, (status) => {
      if (!(status >= 200 && status < 300)) {
        window.location.href = BASE_URL.test_landing_page;

        // setLoading(false);
        return;
      }
      if (status === 200) {
        if (!localStorageGetter("path")) {
          // setLoading(false);
          return navigate(ROOT_PATH);
        }
        // setLoading(false);
        return navigate(localStorageGetter("path") ?? ROOT_PATH);
      }
      // setLoading(false);
    });
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    initialize(cancelToken.token);

    return () => cancelToken.cancel();
  }, []);

  return children;
}

export default ProtectedRoutes;
