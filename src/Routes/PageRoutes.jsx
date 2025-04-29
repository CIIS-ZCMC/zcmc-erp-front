import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

import AnnualOps from "../Pages/DeptHead/AnnualOps/AnnualOps";

// table views routes
import All from "../Pages/DeptHead/AnnualOps/TableViews/All";
import Approved from "../Pages/DeptHead/AnnualOps/TableViews/Approved";
import Pending from "../Pages/DeptHead/AnnualOps/TableViews/Pending";
import Returned from "../Pages/DeptHead/AnnualOps/TableViews/Returned";

import CreateAOP from "../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout";
import AnnualOpsPlanning from '../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives'
import Activities from '../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities'
import Resources from '../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities/Resources';
import ResponsibePerson from '../Pages/DeptHead/AnnualOps/CreateAOP/MainLayout/Objectives/Activities/ResponsiblePerson';

import Items from "../Pages/Items";
import Item from "../Pages/Items/Item";

import ItemRequest from "../Pages/Consolidators/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/Consolidators/ItemManagement/ItemLibrary";
import Objectives from "../Pages/PlanningOps/ObjectiveManagement/Objectives";
import EditPPMP from "../Pages/DeptHead/EditPPMP/EditPPMP";
import ManageAOP from "../Pages/PlanningOps/Approval/ManageAOP";
import AOPApproval from "../Pages/PlanningOps/Approval/AOPApproval";
import AddItems from "../Pages/DeptHead/EditPPMP/AddItems";
import PPMPItems from "../Pages/DeptHead/EditPPMP/PPMPItems";

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
    element: <CreateAOP />,
    children: [
      { index: true, element: <AnnualOpsPlanning /> }, //ENTRY POINT
      {
        path: "activities/:objectiveId",
        element: <Activities />,
        children: [
          {
            path: "resources/:activityId",
            element: <Resources />,
          },

          {
            path: "person/:activityId",
            element: <ResponsibePerson />,
          },
        ],
      },
    ],
  },

  {
    path: "/items",
    children: [
      { index: true, element: <Items /> },
    ],
  },

  {
    path: "/aop-approval",
    children: [
      { index: true, element: <AOPApproval /> },
      { path: "objectives/:id", element: <ManageAOP /> },
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
        element: <PPMPItems />,
      },
      {
        path: "add-item/:activityId/:expenseId",
        element: <AddItems />,
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
