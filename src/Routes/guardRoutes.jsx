// Routes/guardRoutes.js
import RouteGuard from "./RouteGuard";

export const guardRoutes = (
  routes,
  inheritedPermissions = [],
  inheritedBudgetOfficerOnly = false,
) => {
  return routes.map((route) => {
    const {
      element,
      children,
      permissions,
      childPermissions,
      budgetOfficerOnly,
      ...rest
    } = route;

    // Permissions cascade downward
    const effectivePermissions =
      childPermissions || permissions || inheritedPermissions;
    const effectiveBudgetOfficerOnly =
      Boolean(budgetOfficerOnly) || inheritedBudgetOfficerOnly;

    const guardedRoute = {
      ...rest,
      ...(element && {
        element: (
          <RouteGuard
            permissions={effectivePermissions}
            budgetOfficerOnly={effectiveBudgetOfficerOnly}
          >
            {element}
          </RouteGuard>
        ),
      }),
    };

    if (children) {
      guardedRoute.children = guardRoutes(
        children,
        effectivePermissions,
        effectiveBudgetOfficerOnly,
      );
    }

    return guardedRoute;
  });
};
