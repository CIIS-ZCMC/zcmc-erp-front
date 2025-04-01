import { BiCategory } from "react-icons/bi";
import { GrDocument } from "react-icons/gr";

import { Settings } from "lucide-react";

export const sidebarRoutes = [
  {
    name: "Dashboard",
    icon: <BiCategory />,
    path: "/dashboard",
  },

  {
    name: "Planning and Operations",
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
        path: "/objectives",
        name: "Objectives",
      },
    ],
  },

  {
    name: "Item Information Management",
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
    ],
  },
];

export const AOPPathMap = {
  0: "all",
  1: "pending",
  2: "returned",
  3: "approved",
};

export const AOP_STEP_HEADER = [
  { id: 1, header: "Type of function" },
  { id: 2, header: "Objectives" },
  { id: 3, header: "Success Indicator" },
  { id: 4, header: "Actions" },
];

export const FUNCTION_TYPE_OPTION = [
  { id: 1, name: "Strategic", value: "Strategic" },
  { id: 2, name: "Core", value: "Core" },
  { id: 3, name: "Support", value: "Support" },
];

export const OBJECTIVE_OPTION = [
  { id: 1, name: "Objective 1", value: "Objective 1" },
  { id: 2, name: "Objective 2", value: "Objective 2" },
  { id: 3, name: "Objective 3", value: "Objective 3" },
];

export const SUCCESS_INDICATOR_OPTION = [
  { id: 1, name: "Success Indicator 1", value: "Success Indicator 1" },
  { id: 2, name: "Success Indicator 2", value: "Success Indicator 2" },
  { id: 3, name: "Success Indicator 3", value: "Success Indicator 3" },
];
