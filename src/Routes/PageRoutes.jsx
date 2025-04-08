import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

import AnnualOps from "../Pages/PlanningOps/AnnualOps/AnnualOps";
// table views routes
import All from "../Pages/PlanningOps/AnnualOps/TableViews/All";
import Approved from "../Pages/PlanningOps/AnnualOps/TableViews/Approved";
import Pending from "../Pages/PlanningOps/AnnualOps/TableViews/Pending";
import Returned from "../Pages/PlanningOps/AnnualOps/TableViews/Returned";

import CreateAOP from "../Pages/PlanningOps/AnnualOps/CreateAOP";
import Activities from "../Pages/PlanningOps/AnnualOps/CreateAOP/Activities";
import Items from "../Pages/PlanningOps/AnnualOps/CreateAOP/Activities/Items";
import Resources from "../Pages/PlanningOps/AnnualOps/CreateAOP/Activities/Resources";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary";
import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
import EditPPMP from "../Pages/DeptHead/EditPPMP/EditPPMP";
import ManageObjectives from "../Pages/PlanningOps/Approval/ManageObjectives";
import AOPApproval from "../Pages/PlanningOps/Approval/AOPApproval";

export const sidebarRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
  },

  //Planning and Operations routes
  {
    path: "/aop",
    name: "AOP Management",
    element: <AnnualOps />,
    children: [
      {
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
    path: "/aop-approval",
    children: [
      { index: true, element: <AOPApproval /> },
      { path: "objectives/:id", element: <ManageObjectives /> },
    ],
  },

  {
    path: "/aop-create",
    element: <CreateAOP />,
    children: [
      {
        path: "activities/:id",
        element: <Activities />,
        children: [
          {
            path: "items",
            element: <Items />, //item resource
            // children: [
            //   {
            //     path: "resources/:id",
            //     element: <Resources />,
            //   },
            // ]
          },
        ],
      },
    ],
  },
  {
    path: "/edit-ppmp",
    name: "Edit PPMP",
    element: <EditPPMP />,
  },
  {
    path: "/objectives",
    name: "Objectives and KPIs",
    element: <Objectives />,
  },

  //Item Management routes
  {
    path: "/item-requests",
    name: "Request",
    element: <ItemRequest />,
  },

  {
    path: "/item-library",
    name: "Library",
    element: <ItemLibrary />,
  },
];
