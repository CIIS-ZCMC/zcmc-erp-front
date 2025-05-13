import { useLocation } from "react-router-dom";

// ProtectedRoutes component for both children and direct elements
const ProtectedRoutes = ({ children, requiredRoles = [] }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Redirect to login with return location
    return <Navigate to="/welcome" state={{ from: location }} replace />; // how to fix this when page reload I want to stay in the selected path
  }

  // Check if user has required role (if specified)
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    // Return to previous route with warning
    return (
      <Navigate
        to={location.state?.from?.pathname || "/"}
        state={{
          from: location,
          roleWarning: true,
        }}
        replace
      />
    );
  }

  // Return children if provided, otherwise return Outlet
  return children || <Outlet />;
};

export default ProtectedRoutes;
