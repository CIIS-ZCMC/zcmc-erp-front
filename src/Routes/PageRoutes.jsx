import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

// import AOP from "../Pages/AOP/EndUser/AOP";
import Objectives from "../Pages/AOP/EndUser/Objectives/Objectives";
import Activities from "../Pages/AOP/EndUser/Activities/Activities";
import ResponsiblePerson from "../Pages/AOP/EndUser/Responsible/ResponsiblePerson";

import Items from "../Pages/Items";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary";
// import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
import EditPPMP from "../Pages/DeptHead/PPMP/EditPPMP";
import ManageAOP from "../Pages/PlanningOps/Approval/ManageAOP";
import AOPApproval from "../Pages/PlanningOps/Approval/AOPApproval";
import AddItems from "../Pages/DeptHead/PPMP/AddItems";
import PPMPItems from "../Pages/DeptHead/PPMP/PPMPItems";
import PPMPDashboard from "../Pages/DeptHead/PPMP/PPMPDashboard";
import PPMPApproval from "../Pages/PPMP/Approval/PPMPApproval";
import ManagePPMP from "../Pages/PPMP/Approval/ManagePPMP";

import { Items as ConsolidatorItems } from "../Pages/Consolidators/Tabs/Items";
import { Classification } from "../Pages/Consolidators/Tabs/Classification";
import { Category } from "../Pages/Consolidators/Tabs/Category";
import { Variant } from "../Pages/Consolidators/Tabs/Variant";
import { LayoutDashboard, Lock, PersonStanding } from "lucide-react";
import {
  MdDashboard,
  MdLibraryBooks,
  MdSettings,
  MdSupervisorAccount,
} from "react-icons/md";

const iconStyles = {
  size: 24,
};
import ItemSubmittedRequestsList from "../Pages/TEMP/ItemSubmittedRequestsList";
import { MyOwnRequestsList } from "../Pages/TEMP/ItemMyOwnRequestsLists";
import { ItemRequestDatatable } from "../Pages/Consolidators/ItemManagement/ItemRequestDatatable";
import AOP from "../Pages/AOP/EndUser/AOPDashboard";
import { element } from "prop-types";
import ManageResources from "../Pages/AOP/EndUser/Resources/ManageResources";
import AOPOutlet from "../Pages/AOP/EndUser/AOPOutlet";
import AddResources from "../Pages/AOP/EndUser/Resources/AddResources";
// import ResponsiblePerson from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities/ResponsiblePerson";

export const sidebarRoutes = [
  // DASHBOARD ROUTE
  {
    path: "/dashboard",
    name: "AOP",
    element: <Dashboard />,
    icon: <MdDashboard {...iconStyles} />,
    permissions: ["*"],
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
        element: <AOPOutlet />,
        childPermissions: ["ERP-AOP-MAN:write"],
        children: [
          {
            index: true,
            element: <AOP />,
          },
          {
            path: "objectives/:aopId",
            element: <Objectives />,
          },
          {
            path: "activities/:objectiveId",
            element: <Activities />,
          },
          {
            path: "responsible-person/:activityId",
            element: <ResponsiblePerson />,
          },
          {
            path: "manage-resources/:activityId",
            element: <ManageResources />,
          },
          {
            path: "select-resources/:activityId",
            element: <AddResources />,
          },
        ],
      },

      // {
      //   path: "/aop-management",
      //   element: <AOP />,
      //   roles: ["super_admin"],
      //   childPermissions: ["ERP-AOP-MAN:write"],
      //   children: [
      //     {
      //       index: true,
      //       element: <AOPObjectives />,
      //     },
      //     {
      //       path: "activities/:objectiveId",
      //       element: <Activities />,
      //       children: [
      //         {
      //           path: "items/:activityId",
      //           element: <Items />,
      //         },
      //         {
      //           path: "resources/:activityId",
      //           element: <Resources />,
      //           roles: ["super_admin"],
      //         },

      //         {
      //           path: "person/:activityId",
      //           element: <Responsible />,
      //           roles: ["super_admin"],
      //         },
      //       ],
      //     },
      //   ],
      // },

      {
        path: "/edit-ppmp",
        name: "Edit PPMP",
        element: <EditPPMP />,
        childPermissions: ["ERP-PPMP-MAN:write"],
        children: [
          {
            index: true,
            element: <PPMPDashboard />,
          },
          {
            path: "ppmp-items",
            element: <PPMPItems />,
          },
          {
            path: "add-item",
            element: <AddItems />,
          },
        ],
      },
    ],
  },

  // AOP AND PPPMP

  // {
  //   path: "/items/:activityId",
  //   children: [{ index: true, element: <Items /> }],
  // },
  {
    parentPath: "/planning-ops",
    name: "Planning and Operations",
    icon: <MdLibraryBooks {...iconStyles} />,
    permissions: [
      // "ERP-AOP-MAN:approve",
      // "ERP-PPMP-MAN:approve",
      // "ERP-OBJ-MAN:write",
      // "ERP-OBJ-MAN:view",
      // "ERP-OBJ-MAN:update",
      // "ERP-OBJ-MAN:view-all",
    ],
    children: [
      {
        path: "/aop-approval",
        name: "AOP Management",
        childPermissions: ["ERP-AOP-MAN:approve"],
        children: [
          { index: true, element: <AOPApproval /> },
          {
            path: "objectives/:id",
            element: <ManageAOP />,
          },
        ],
      },

      {
        path: "/ppmp-approval",
        name: "PPMP Management",
        childPermissions: ["ERP-PPMP-MAN:approve"],
        children: [
          { index: true, element: <PPMPApproval /> },
          {
            path: "view/:id",
            element: <ManagePPMP />,
          },
        ],
      },

      {
        path: "/objectives",
        name: "Objectives and KPIs",
        element: <Objectives />,
        childPermissions: [
          "ERP-OBJ-MAN:write",
          "ERP-OBJ-MAN:view",
          "ERP-OBJ-MAN:update",
          "ERP-OBJ-MAN:view-all",
        ],
      },
      {
        path: "/dealine-management",
        name: "Deadline Management",
        children: [{ index: true, element: <>Deadline Management</> }],
        childPermissions: ["ERP-DEAD-MAN:write"],
      },
    ],
  },

  //Item Management routes
  {
    path: "/item-requests",
    name: "Request",
    element: <ItemRequest />,
    roles: ["super_admin"],
    abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
    children: [
      {
        index: true,
        element: <ItemRequestDatatable />,
      },
      {
        path: "pending",
        element: <>pending</>,
      },
      {
        path: "added",
        element: <>added</>,
      },
    ],
  },
  // CONSOLIDATOR ROUTES
  {
    parentPath: "/consolidator",
    name: "Item Management",
    icon: <MdSettings {...iconStyles} />,
    permissions: [
      "IM-001:write",
      "IM-001:view",
      "IM-001:view-all",
      "IM-001:update",
      "IM-001:approve",
      "IM-001:request",
      "IM-001:delete",
    ],
    children: [
      {
        path: "/item-requests",
        name: "Item Requests",
        element: <ItemRequest />,
        childPermissions: [
          "IM-001:read",
          "IM-001:write",
          "IM-001:edit",
          "IM-001:delete",
        ],
      },

      {
        path: "/item-library",
        name: "Libraries",
        element: <ItemLibrary />,
        childPermissions: [
          "IM-001:read",
          "IM-001:write",
          "IM-001:edit",
          "IM-001:delete",
        ],
        children: [
          {
            index: true,
            element: <ConsolidatorItems />,
          },
          {
            path: "classification",
            element: <Classification />,
          },
          {
            path: "category",
            element: <Category />,
          },
          {
            path: "variant",
            element: <Variant />,
          },
        ],
      },
    ],
  },
  {
    path: "/submitted-items",
    name: "Submitted Items",
    element: <ItemSubmittedRequestsList />,
    roles: ["super_admin"],
    permissions: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
    children: [
      {
        index: true,
        element: <MyOwnRequestsList />,
      },
      {
        path: "pending",
        element: <>pending</>,
      },
      {
        path: "added",
        element: <>added</>,
      },
    ],
  },
  {
    path: "/submitted-items",
    name: "Submitted Items",
    element: <ItemSubmittedRequestsList />,
    roles: ["super_admin"],
    permissions: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
    children: [
      {
        index: true,
        element: <MyOwnRequestsList />,
      },
      {
        path: "pending",
        element: <>pending</>,
      },
      {
        path: "added",
        element: <>added</>,
      },
    ],
  },
  {
    path: "/submitted-items",
    name: "Submitted Items",
    element: <ItemSubmittedRequestsList />,
    roles: ["super_admin"],
    permissions: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
    children: [
      {
        index: true,
        element: <MyOwnRequestsList />,
      },
      {
        path: "pending",
        element: <>pending</>,
      },
      {
        path: "added",
        element: <>added</>,
      },
    ],
  },
];
