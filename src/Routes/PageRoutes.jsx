import { Navigate } from "react-router-dom";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AOP from "../Pages/AOP/EndUser/AOPDashboard";
import AOPSummary from "../Pages/AOP/EndUser/AOPSummary";
import Objectives from "../Pages/AOP/EndUser/Objectives/Objectives";
import Activities from "../Pages/AOP/EndUser/Activities/Activities";
import ManageResources from "../Pages/AOP/EndUser/Resources/ManageResources";
import AOPOutlet from "../Pages/AOP/EndUser/AOPOutlet";
import AddResources from "../Pages/AOP/EndUser/Resources/AddResources";
import ResponsiblePerson from "../Pages/AOP/EndUser/Responsible/ResponsiblePerson";
import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary/ItemLibrary";
import ManageAOP from "../Pages/AOP/Approval/ManageAOP";
import AOPApproval from "../Pages/AOP/Approval/AOPApproval";
import {
  MdDashboard,
  MdLibraryBooks,
  MdSettings,
  MdSupervisorAccount,
} from "react-icons/md";
import PPMPDashboard from "../Pages/PPMP/EndUser/Dashboard/PPMPDashboard";
import PPMPItems from "../Pages/PPMP/EndUser/PPMPItems";
import AddItems from "../Pages/PPMP/EndUser/AddItems";
import PPMPOutlet from "../Pages/PPMP/EndUser/PPMPOutlet";
import ViewPPMP from "../Pages/PPMP/Approval/ViewPPMP";
import ManageObjectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
import ManageConsolidators from "../Pages/PlanningOps/ManageConsolidators/ManageConsolidators";
import { Items } from "../Pages/Consolidators/ItemManagement/ItemLibrary/Tabs/Items";
import All from "../Pages/Consolidators/ItemManagement/ItemRequest/All";
import Pending from "../Pages/Consolidators/ItemManagement/ItemRequest/Pending";
import Saved from "../Pages/Consolidators/ItemManagement/ItemRequest/Saved";
import { Classification } from "../Pages/Consolidators/ItemManagement/ItemLibrary/Tabs/Classification";
import { Category } from "../Pages/Consolidators/ItemManagement/ItemLibrary/Tabs/Category";
import { Variant } from "../Pages/Consolidators/ItemManagement/ItemLibrary/Tabs/Variant";
import Declined from "@Pages/Consolidators/ItemManagement/ItemRequest/Declined";
import BudgetDeliberation from "@Pages/PPMP/Approval/BudgetDeliberation";
import ItemRequestsLayout from "@Pages/AOP/EndUser/ItemRequests/ItemRequestsLayout";
import AllRequests from "@Pages/AOP/EndUser/ItemRequests/AllRequests";
import PendingRequests from "@Pages/AOP/EndUser/ItemRequests/PendingRequests";
import ApprovedRequests from "@Pages/AOP/EndUser/ItemRequests/ApprovedRequests";
import DeclinedRequests from "@Pages/AOP/EndUser/ItemRequests/DeclinedRequests";

const iconStyles = {
  size: 24,
};
export const sidebarRoutes = [
  // DASHBOARD ROUTE
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
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
            path: "manage-items/:type",
            element: <PPMPItems />,
          },
          {
            path: "add-item/:type",
            element: <AddItems />,
          },
        ],
      },

      {
        path: "/new-item-requests",
        name: "My Item Requests",
        element: <ItemRequestsLayout />,
        childPermissions: ["ERP-PPMP-MAN:write", "ERP-AOP-MAN:write"],
        children: [
          {
            index: true,
            element: <AllRequests />,
          },
          {
            path: "pending",
            element: <PendingRequests />,
          },
          {
            path: "approved",
            element: <ApprovedRequests />,
          },
          {
            path: "declined",
            element: <DeclinedRequests />,
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
        children: [
          { index: true, element: <AOPApproval /> },
          {
            path: "objectives/:id",
            element: <ManageAOP />,
          },
          {
            path: "view-ppmp/:id/:type",
            element: <ViewPPMP />,
          },
        ],
      },

      {
        path: "/manage-objectives",
        name: "Manage Objectives",
        element: <ManageObjectives />,
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
        element: <ManageConsolidators />,
        childPermissions: [
          // change to item consolidators permissions
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
        element: <BudgetDeliberation />,
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
          {
            path: "declined",
            element: <Declined />,
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
            element: <Items />,
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
