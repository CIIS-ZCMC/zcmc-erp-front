import {
  MdDashboard,
  MdLibraryBooks,
  MdSettings,
  MdSupervisorAccount,
} from "react-icons/md";

const iconStyles = {
  size: 24,
};

export const sidebarConfig = [
  // DASHBOARD ROUTE
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <MdDashboard {...iconStyles} />,
    permissions: ["ERP-AOP-MAN:approve", "ERP-PPMP-MAN:approve"],
  },

  // SUPERVISOR ROUTES
  {
    parentPath: "/supervisor",
    name: "Supervisor",
    icon: <MdSupervisorAccount {...iconStyles} />,
    permissions: ["ERP-AOP-MAN:write", "ERP-PPMP-MAN:write"],
    children: [
      {
        path: "/aop",
        name: "AOP",
        childPermissions: ["ERP-AOP-MAN:write"],
      },
      {
        path: "/ppmp",
        name: "Edit PPMP",
        childPermissions: ["ERP-PPMP-MAN:write"],
      },
      {
        path: "/new-item-requests",
        name: "My Item Requests",
        childPermissions: ["ERP-PPMP-MAN:write", "ERP-AOP-MAN:write"],
      },
    ],
  },

  // PLANNING AND OPERATIONS ROUTES
  {
    parentPath: "/planning-ops",
    name: "Planning and Operations",
    icon: <MdLibraryBooks {...iconStyles} />,
    permissions: [
      "ERP-AOP-MAN:approve",
      "ERP-PPMP-MAN:approve",
      "ERP-OBJ-MAN:write",
      "ERP-OBJ-MAN:view",
      "ERP-OBJ-MAN:update",
      "ERP-OBJ-MAN:view-all",
      "ERP-CONSO-MAN:write",
      "ERP-CONSO-MAN:view-all",
      "ERP-CONSO-MAN:update",
      "ERP-CONSO-MAN:approve",
      "ERP-CONSO-MAN:delete",
      "ERP-CONSO-MAN:download",
    ],
    children: [
      {
        path: "/approval",
        name: "Manage AOP and PPMP",
        childPermissions: ["ERP-AOP-MAN:approve", "ERP-PPMP-MAN:approve"],
      },
      {
        path: "/manage-objectives",
        name: "Manage Objectives",
        childPermissions: [
          "ERP-OBJ-MAN:write",
          "ERP-OBJ-MAN:view",
          "ERP-OBJ-MAN:update",
          "ERP-OBJ-MAN:view-all",
        ],
      },
      {
        path: "/manage-consolidators",
        name: "Manage Dispensing Units and Consolidators",
        childPermissions: [
          "ERP-CONSO-MAN:write",
          "ERP-CONSO-MAN:view-all",
          "ERP-CONSO-MAN:update",
          "ERP-CONSO-MAN:approve",
          "ERP-CONSO-MAN:delete",
          "ERP-CONSO-MAN:download",
        ],
      },
      {
        path: "/budget-deliberation",
        name: "Budget Deliberation",
        childPermissions: ["ERP-PPMP-MAN:approve"],
      },
    ],
  },

  // CONSOLIDATOR ROUTES
  {
    parentPath: "/consolidator",
    name: "Item Management",
    icon: <MdSettings {...iconStyles} />,
    permissions: [
      "ERP-ITM-MAN:write",
      "ERP-ITM-MAN:view",
      "ERP-ITM-MAN:view-all",
      "ERP-ITM-MAN:update",
      "ERP-ITM-MAN:approve",
      "ERP-ITM-MAN:delete",
    ],
    children: [
      {
        path: "/item-requests",
        name: "Item Requests",
        childPermissions: [
          "ERP-ITM-MAN:read",
          "ERP-ITM-MAN:write",
          "ERP-ITM-MAN:edit",
          "ERP-ITM-MAN:delete",
        ],
      },
      {
        path: "/item-library",
        name: "Libraries",
        childPermissions: [
          "ERP-ITM-MAN:read",
          "ERP-ITM-MAN:write",
          "ERP-ITM-MAN:edit",
          "ERP-ITM-MAN:delete",
        ],
      },
    ],
  },
];
