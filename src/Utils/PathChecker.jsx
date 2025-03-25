import { useLocation } from "react-router-dom";

export const isActive = (url) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation();
  return location.pathname.split("/")[1] === url;
};
