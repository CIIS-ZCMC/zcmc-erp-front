import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard/Dashboard";

// import AOP from "../Pages/AOP/EndUser/AOP";
import AOP from "../Pages/AOP/EndUser/AOPDashboard";
import AOPSummary from "../Pages/AOP/EndUser/AOPSummary";
import Objectives from "../Pages/AOP/EndUser/Objectives/Objectives";
import Activities from "../Pages/AOP/EndUser/Activities/Activities";
import ManageResources from "../Pages/AOP/EndUser/Resources/ManageResources";
import AOPOutlet from "../Pages/AOP/EndUser/AOPOutlet";
import AddResources from "../Pages/AOP/EndUser/Resources/AddResources";
import ResponsiblePerson from "../Pages/AOP/EndUser/Responsible/ResponsiblePerson";

import Items from "../Pages/Items";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/Library/ItemLibrary";
// import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
import ManageAOP from "../Pages/AOP/Approval/ManageAOP";
import AOPApproval from "../Pages/AOP/Approval/AOPApproval";
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

import { element } from "prop-types";

import PPMPDashboard from "../Pages/PPMP/EndUser/PPMPDashboard";
import PPMPItems from "../Pages/PPMP/EndUser/PPMPItems";
import AddItems from "../Pages/PPMP/EndUser/AddItems";
import PPMPOutlet from "../Pages/PPMP/EndUser/PPMPOutlet";
import All from "../Pages/Consolidators/ItemManagement/ItemRequest/All";
import Pending from "../Pages/Consolidators/ItemManagement/ItemRequest/Pending";
import Saved from "../Pages/Consolidators/ItemManagement/ItemRequest/Saved";
import ViewPPMP from "../Pages/PPMP/Approval/ViewPPMP";
import ManageObjectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";

export const sidebarRoutes = [
  // DASHBOARD ROUTE
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
    icon: <MdDashboard {...iconStyles} />,
    permissions: ["ERP-PPMP-MAN:approve", "ERP-PPMP-MAN:approve"],
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
            path: "summary",
            element: <AOPSummary />,
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

      {
        path: "/ppmp",
        name: "Edit PPMP",
        element: <PPMPOutlet />,
        childPermissions: ["ERP-PPMP-MAN:write"],
        children: [
          {
            index: true,
            element: <PPMPDashboard />,
          },
          {
            path: "manage-items",
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
    ],
    children: [
      {
        path: "/aop-approval",
        name: "AOP and PPMP Management",
        childPermissions: ["ERP-AOP-MAN:approve", "ERP-PPMP-MAN:approve"],
        children: [
          { index: true, element: <AOPApproval /> },
          {
            path: "objectives/:id",
            element: <ManageAOP />,
          },
          {
            path: "view-ppmp/:id",
            element: <ViewPPMP />,
          },
        ],
      },

      // {
      //   path: "/ppmp-approval",
      //   name: "PPMP Management",
      //   childPermissions: ["ERP-PPMP-MAN:approve"],
      //   children: [
      //     { index: true, element: <PPMPApproval /> },
      //     {
      //       path: "view/:id",
      //       element: <ManagePPMP />,
      //     },
      //   ],
      // },

      {
        path: "/objectives",
        name: "Objectives and KPIs",
        element: <ManageObjectives />,
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
      "ERP-ITM-MAN:request",
      "ERP-ITM-MAN:delete",
    ],
    children: [
      {
        path: "/item-requests",
        name: "Item Requests",
        element: <ItemRequest />,
        childPermissions: [
          "ERP-ITM-MAN:read",
          "ERP-ITM-MAN:write",
          "ERP-ITM-MAN:edit",
          "ERP-ITM-MAN:delete",
        ],
        children: [
          {
            index: true,
            element: <All />,
          },
          {
            path: "pending",
            element: <Pending />,
          },
          {
            path: "saved",
            element: <Saved />,
          },
        ],
      },

      {
        path: "/item-library",
        name: "Libraries",
        element: <ItemLibrary />,
        childPermissions: [
          "ERP-ITM-MAN:read",
          "ERP-ITM-MAN:write",
          "ERP-ITM-MAN:edit",
          "ERP-ITM-MAN:delete",
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
];
