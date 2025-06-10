import { Stack, Typography } from "@mui/joy";

import { BiCategory } from "react-icons/bi";
import { GrDocument } from "react-icons/gr";

import { Settings } from "lucide-react";

import {
  MdDashboard,
  MdLibraryBooks,
  MdSettings,
  MdSupervisorAccount,
} from "react-icons/md";

const iconStyles = {
  size: 24,
};

export const sidebarRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <MdDashboard {...iconStyles} />,
    permissions: ["*"],
  },

  {
    parentPath: "/supervisor",
    name: "Supervisor",
    icon: <MdSupervisorAccount {...iconStyles} />,
    permissions: ["ERP-AOP-MAN:write", "ERP-PPMP-MAN:write"],
    children: [
      {
        path: "/aop",
        name: "AOP",
        childPermissions: ["ERP-AOP-MAN:write"],
      },

      {
        path: "/edit-ppmp",
        name: "Edit PPMP",
        childPermissions: ["ERP-PPMP-MAN:write"],
      },
      {
        path: "/Submitted-items",
        name: "Requested Items",
      },
      {
        path: "/manage-deadlines",
        name: "Manage Deadlines",
      },
    ],
  },

  {
    parentPath: "/planning-ops",
    name: "Planning and Operations",
    icon: <MdLibraryBooks {...iconStyles} />,
    permissions: [
      "ERP-AOP-MAN:approve",
      "ERP-AOP-MAN:view-all",
      "ERP-PPMP-MAN:approve",
      "ERP-PPMP-MAN:view-all",
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
          {
            path: "objectives/:id",
          },
        ],
      },

      {
        path: "/ppmp-approval",
        name: "PPMP Management",
        childPermissions: ["ERP-PPMP-MAN:approve", "ERP-PPMP-MAN:view-all"],
        children: [
          {
            path: "view/:id",
          },
        ],
      },

      {
        path: "/objectives",
        name: "Objectives and KPIs",
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
        childPermissions: ["ERP-DEAD-MAN:write"],
      },
    ]
  },

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
        childPermissions: [
          "IM-001:read",
          "IM-001:write",
          "IM-001:edit",
          "IM-001:delete",
        ],
        children: [
          {
            path: "classification",
          },
          {
            path: "category",
          },
          {
            path: "variant",
          },
        ],
      },
    ],
  },
]

export const AOPPathMap = {
  0: "all",
  1: "pending",
  2: "returned",
  3: "approved",
};

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

export const CART_ITEMS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    specType: "High-end",
    category: "Electronics",
    price: 129.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    specType: "High-end",
    category: "Wearables",
    price: 89.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.2,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    specType: "High-end",
    category: "Clothing",
    price: 24.99,
    quantity: 3,
    image:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.0,
    color: "Navy Blue",
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    specType: "High-end",
    category: "Accessories",
    price: 19.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Wireless Phone Charger",
    specType: "High-end",
    category: "Electronics",
    price: 34.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: false, // Out of stock item
    rating: 3.8,
    backorder: true,
  },
];
