import RequirePermission from "./RequirePermission";

const clean = (path = "") => path.replace(/^\/+|\/+$/g, "");

export const mapRoutesWithPermissions = (
  routes,
  parentPath = "",
  inheritedPermissions = [],
) => {
  return routes.map((route) => {
    const {
      path,
      parentPath: routeParentPath,
      element,
      permissions,
      childPermissions,
      children,
      index,
    } = route;

    // 1️⃣ Normalize paths
    const base = clean(parentPath);
    const parent = clean(routeParentPath);
    const current = clean(path);

    const fullPath = index
      ? undefined
      : [base, parent, current].filter(Boolean).join("/");

    // 2️⃣ Resolve permissions
    const resolvedPermissions =
      childPermissions || permissions || inheritedPermissions;

    // 3️⃣ Wrap element safely
    const wrappedElement = element ? (
      <RequirePermission permissions={resolvedPermissions}>
        {element}
      </RequirePermission>
    ) : undefined;

    // 4️⃣ Build route object
    const mappedRoute = index
      ? { index: true, element: wrappedElement }
      : { path: `/${fullPath}`, element: wrappedElement };

    // 5️⃣ Recurse children
    if (children) {
      mappedRoute.children = mapRoutesWithPermissions(
        children,
        `/${fullPath}`,
        resolvedPermissions,
      );
    }

    return mappedRoute;
  });
};
