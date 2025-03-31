import { BiCategory } from "react-icons/bi";
import { GrDocument } from "react-icons/gr";

import { Settings } from "lucide-react";

export const sidebarRoutes = [
    {
        name: 'Dashboard',
        icon: <BiCategory />,
        path: '/dashboard',

    },

    {
        name: 'Planning and Operations',
        icon: <GrDocument />,
        children: [
            {
                path: "/aop",
                name: "AOP Management",
            },

            {
                path: "/ppmp",
                name: "PPMP Management",
            },

            {
                path: "/qualitative-evaluation",
                name: "Qualitative Evaluation",
            },

        ]
    },

    {
        name: 'Item Information Management',
        icon: <Settings />,
        children: [
            {
                path: "/item-requests",
                name: " Item requests",
            },

            {
                path: "/item-library",
                name: " Item library",
            },

        ]
    }

]

export const AOPPathMap = {
    0: 'all',
    1: 'pending',
    2: 'returned',
    3: 'approved'
}