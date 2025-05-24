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
import Item from "../Pages/Items/Item";

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

export const sidebarRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
    roles: ["super_admin"],
    abilities: ["M-001:read"],
  },

  //Planning and Operations routes
  {
    path: "/aop",
    name: "AOP Management",
    element: <AnnualOps />,
    roles: ["super_admin"],
    abilities: [
      "M-001:read",
      "M-001:write",
      "M-001:edit",
      "M-001:delete",
      "M-001:approve",
    ],
    children: [
      {
        index: true,
        element: <Navigate to="all" replace />,
        roles: ["super_admin"],
        abilities: ["M-001:read"],
      },
      {
        path: "all",
        element: <All />,
        roles: ["super_admin"],
        abilities: ["M-001:read"],
      },
      {
        path: "approved",
        element: <Approved />,
        roles: ["super_admin"],
        abilities: ["M-001:approve"],
      },
      {
        path: "pending",
        element: <Pending />,
        roles: ["super_admin"],
        abilities: ["M-001:read", "M-001:approve"],
      },
      {
        path: "returned",
        element: <Returned />,
        roles: ["super_admin"],
        abilities: ["M-001:read", "M-001:edit", "M-001:approve"],
      },
    ],
  },

  {
    path: "/aop-create",
    element: <CreateAOP />,
    roles: ["super_admin"],
    abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
    children: [
      { index: true, element: <AnnualOpsPlanning /> }, //ENTRY POINT
      {
        path: "activities/:objectiveId",
        element: <Activities />,
        children: [
          {
            path: "items/:activityId",
            element: <Items />
          },
          {
            path: "resources/:activityId",
            element: <Resources />,
            roles: ["super_admin"],
            abilities: [
              "M-001:read",
              "M-001:write",
              "M-001:edit",
              "M-001:delete",
            ],
          },

          {
            path: "person/:activityId",
            element: <ResponsibePerson />,
            roles: ["super_admin"],
            abilities: [
              "M-001:read",
              "M-001:write",
              "M-001:edit",
              "M-001:delete",
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/aop-edit/:id",
    element: <>Edit AOP </>,
    roles: ["super_admin"],
  },

  // {
  //   path: "/items/:activityId",
  //   children: [{ index: true, element: <Items /> }],
  // },

  {
    path: "/aop-approval",
    children: [
      { index: true, element: <AOPApproval /> },
      {
        path: "objectives/:id",
        element: <ManageAOP />,
        roles: ["super_admin"],
        abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
      },
    ],
  },

  // SAMPLE PATH
  // {
  //   path: "aop-create",
  //   element: <Main />,
  //   children: [
  //     { index: true, element: <Contact /> },
  //     {
  //       path: "activities/1",
  //       element: <About />,
  //     },
  //   ],
  // },

  {
    path: "/edit-ppmp",
    name: "Edit PPMP",
    element: <EditPPMP />,
    children: [
      {
        index: true,
        element: <PPMPDashboard />,
      },
      {
        path: "ppmp-items",
        element: <PPMPItems />,
        roles: ["super_admin"],
        abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
      },
      {
        path: "add-item/:expenseId",
        element: <AddItems />,
        roles: ["super_admin"],
        abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
      },
    ],
  },
  {
    path: "/ppmp-approval",
    children: [
      { index: true, element: <PPMPApproval /> },
      {
        path: "view/:id",
        element: <ManagePPMP />,
        roles: ["super_admin"],
        abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
      },
    ],
  },

  {
    path: "/objectives",
    name: "Objectives and KPIs",
    element: <Objectives />,
    roles: ["super_admin"],
    abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
  },

  //Item Management routes
  {
    path: "/item-requests",
    name: "Request",
    element: <ItemRequest />,
    roles: ["super_admin"],
    abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
  },

  {
    path: "/item-library",
    name: "Library",
    element: <ItemLibrary />,
    roles: ["super_admin"],
    abilities: ["M-001:read", "M-001:write", "M-001:edit", "M-001:delete"],
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
];
