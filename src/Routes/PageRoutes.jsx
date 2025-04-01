import { Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";

import AnnualOps from "../Pages/PlanningOps/AnnualOps/AnnualOps";
// table views routes
import All from '../Pages/PlanningOps/AnnualOps/TableViews/All';
import Approved from '../Pages/PlanningOps/AnnualOps/TableViews/Approved';
import Pending from '../Pages/PlanningOps/AnnualOps/TableViews/Pending';
import Returned from '../Pages/PlanningOps/AnnualOps/TableViews/Returned';

import CreateAOP from "../Pages/PlanningOps/AnnualOps/CreateAOP";
import Activities from '../Pages/PlanningOps/AnnualOps/CreateAOP/Activities';
import Resources from '../Pages/PlanningOps/AnnualOps/CreateAOP/Activities/Resources';

import QualitativeEvaluation from "../Pages/PlanningOps/QualitativeEvaluation";

import ItemRequest from "../Pages/ItemManagement/ItemRequest";
import ItemLibrary from "../Pages/ItemManagement/ItemLibrary";

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
                element: <Navigate to="all" replace />
            },
            {
                path: "all",
                element: <All />
            },
            {
                path: "approved",
                element: <Approved />
            },
            {
                path: "pending",
                element: <Pending />
            },
            {
                path: "returned",
                element: <Returned />
            },
        ]
    },

    {
        path: "/aop-create",
        name: "",
        element: <CreateAOP />,
        children: [
            {
                path: "activities",
                element: <Activities />,
                children: [
                    {
                        path: "resources",
                        element: <Resources />
                    },
                ]
            },
        ]
    },

    {
        path: "/qualitative-evaluation",
        name: "Qualitative evauation",
        element: <QualitativeEvaluation />,
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
]
