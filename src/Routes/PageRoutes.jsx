import Dashboard from "../Pages/Dashboard";

import AnnualOps from "../Pages/PlanningOps/AnnualOps";
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
