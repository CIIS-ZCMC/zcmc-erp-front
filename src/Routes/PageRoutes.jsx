import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

import AnnualOps from "../Pages/DeptHead/AnnualOps/AnnualOps";

// table views routes
import All from "../Pages/DeptHead/AnnualOps/TableViews/All";
import Approved from "../Pages/DeptHead/AnnualOps/TableViews/Approved";
import Pending from "../Pages/DeptHead/AnnualOps/TableViews/Pending";
import Returned from "../Pages/DeptHead/AnnualOps/TableViews/Returned";

import CreateAOP from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout";
import AnnualOpsPlanning from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives";
import Activities from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities";
import Resources from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities/Resources";
import ResponsibePerson from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities/ResponsiblePerson";

import Items from "../Pages/Items";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary";
import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
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
  MdBook,
  MdDashboard,
  MdLibraryBooks,
  MdNextPlan,
  MdOutlineDocumentScanner,
  MdSettings,
  MdSupervisorAccount,
} from "react-icons/md";

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
        path: "/aop/all",
        name: "Create AOP",
        element: <AnnualOps />,
        childPermissions: ["ERP-AOP-MAN:write"],
        children: [
          {
            path: "/aop/all",
            name: "AOP Management",
            index: true,
            element: <Navigate to="all" replace />,
          },
          {
            path: "all",
            element: <All />,
          },
          {
            path: "approved",
            element: <Approved />,
          },
          {
            path: "pending",
            element: <Pending />,
          },
          {
            path: "returned",
            element: <Returned />,
          },
        ],
      },
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
            path: "add-item/:expenseId",
            element: <AddItems />,
          },
        ],
      },
    ],
  },

  // AOP AND PPPMP
  {
    parentPath: "/planning-ops",
    name: "Planning and Operations",
    icon: <MdLibraryBooks {...iconStyles} />,
    permissions: [
      "ERP-AOP-MAN:write",
      "ERP-AOP-MAN:view",
      "ERP-AOP-MAN:update",
      "ERP-AOP-MAN:approve",
      "ERP-AOP-MAN:view-all",
      "ERP-PPMP-MAN:update",
      "ERP-PPMP-MAN:view",
      "ERP-PPMP-MAN:view-all",
      "ERP-PPMP-MAN:write",
      "ERP-PPMP-MAN:delete",
      "ERP-OBJ-MAN:write",
      "ERP-OBJ-MAN:view",
      "ERP-OBJ-MAN:update",
      "ERP-OBJ-MAN:view-all",
    ],
    children: [
      {
        path: "/aop-approval",
        name: "AOP Management",
        childPermissions: ["ERP-AOP-MAN:approve", "ERP-AOP-MAN:view-all"],
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
        childPermissions: ["ERP-PPMP-MAN:approve", "ERP-PPMP-MAN:view-all"],
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
];
