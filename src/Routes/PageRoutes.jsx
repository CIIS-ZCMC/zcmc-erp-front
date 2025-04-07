import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

import AnnualOps from '../Pages/DeptHead/AnnualOps/AnnualOps';

// table views routes
import All from "../Pages/DeptHead/AnnualOps/TableViews/All";
import Approved from "../Pages/DeptHead/AnnualOps/TableViews/Approved";
import Pending from "../Pages/DeptHead/AnnualOps/TableViews/Pending";
import Returned from "../Pages/DeptHead/AnnualOps/TableViews/Returned";

import CreateAOP from "../Pages/DeptHead/AnnualOps/CreateAOP";
import Activities from "../Pages/DeptHead/AnnualOps/CreateAOP/Activities";
import Items from "../Pages/DeptHead/Items";
import Item from '../Pages/DeptHead/Items/Item';
import Resources from "../Pages/DeptHead/AnnualOps/CreateAOP/Activities/Resources";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary";
import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
import AOPApproval from "../Pages/PlanningOps/Approval/AOPApproval";
import EditPPMP from "../Pages/DeptHead/EditPPMP/EditPPMP";

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
    children: [
      { index: true, element: <CreateAOP /> },
      {
        path: "activities/:objectiveId", element: <Activities />,
        children: [
          {
            path: "resources/:activityId",
            element: <Resources />,
          },
        ],
      },
    ],
  },

  {
    path: "/aop-approval",
    name: "AOP Management Approval",
    element: <AOPApproval />,
  },

  {
    path: 'items',
    children: [
      {
        path: ':itemId',
        element: <Item />, //single item profile
      }
    ]
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
