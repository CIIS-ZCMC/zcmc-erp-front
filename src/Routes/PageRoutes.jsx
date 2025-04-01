import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

import AnnualOps from "../Pages/PlanningOps/AnnualOps/AnnualOps";
// table views routes
import All from "../Pages/PlanningOps/AnnualOps/TableViews/All";
import Approved from "../Pages/PlanningOps/AnnualOps/TableViews/Approved";
import Pending from "../Pages/PlanningOps/AnnualOps/TableViews/Pending";
import Returned from "../Pages/PlanningOps/AnnualOps/TableViews/Returned";

import CreateAOP from "../Pages/PlanningOps/AnnualOps/CreateAOP";
//stepper routes
import AOPStep1 from "../Pages/PlanningOps/AnnualOps/CreateAOP/AOPStep1";
import AOPStep2 from "../Pages/PlanningOps/AnnualOps/CreateAOP/AOPStep2";
import AOPStep3 from "../Pages/PlanningOps/AnnualOps/CreateAOP/AOPStep3";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary";
import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";

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
    path: "/aop-create",
    name: "",
    element: <CreateAOP />,
    children: [
      {
        index: true,
        element: <Navigate to="step1" replace />,
      },
      {
        path: "step1",
        element: <AOPStep1 />,
      },
      {
        path: "step2",
        element: <AOPStep2 />,
      },
      {
        path: "step3",
        element: <AOPStep3 />,
      },
    ],
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
