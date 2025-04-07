import { Stack, Typography } from "@mui/joy";

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
        path: "/aop/all",
        name: "AOP Management",
      },

      {
        path: "/aop-approval",
        name: "AOP Management Approval",
      },
      {
        path: "/ppmp",
        name: "PPMP Management",
      },
      {
        path: "/edit-ppmp",
        name: "Edit PPMP",
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
  {
    field: "id",
    name: "Row #",
    width: "5%",
    align: "center",
  },
  {
    field: "function",
    name: "Type of Function",
    width: "30%",
    align: "left",
  },
  {
    field: "objectives",
    name: "Objectives",
    width: "20%",
    align: "center",
  },
  {
    field: "success_indicators",
    name: "Success Indicators",
    width: "20%",
    align: "center",
  },
  {
    field: "actions",
    align: "center",
    name: "Actions",
  },
];

export const ACTIVITIES_HEADER = [
  {
    field: "id",
    name: "Row #",
    width: "4%",
    align: "center",
  },
  {
    field: "activities",
    name: "Activities",
    width: "10%",
    align: "center",
  },

  {
    field: "",
    name: "Timeframe",
    align: "center",
    width: "15%",
    children: [
      { field: "startMonth", name: "Start(Month)" },
      { field: "endMonth", name: "End(Month)" },
    ],
  },
  {
    field: "",
    name: "Target (by quarter)",
    align: "center",
    width: "20%",
    children: [
      { field: "quarter1", name: "Q1", width: "10%" },
      { field: "quarter2", name: "Q2", width: "10%" },
      { field: "quarter3", name: "Q3", width: "10%" },
      { field: "quarter4", name: "Q4", width: "10%" },
    ],
  },

  {
    field: "",
    name: "Cost",
    width: "10%",
    align: "center",
  },

  {
    field: "",
    name: "Is GAD-related activity",
    width: "10%",
    align: "center",
  },

  {
    field: "",
    name: "Responsible Person",
    width: "10%",
    align: "center",
  },

  {
    field: "actions",
    align: "center",
    name: "Actions",
  },
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


export const CART_ITEMS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    specType: "High-end",
    category: "Electronics",
    price: 129.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.5
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    specType: "High-end",
    category: "Wearables",
    price: 89.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.2
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    specType: "High-end",
    category: "Clothing",
    price: 24.99,
    quantity: 3,
    image: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.0,
    color: "Navy Blue"
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    specType: "High-end",
    category: "Accessories",
    price: 19.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: true,
    rating: 4.7
  },
  {
    id: 5,
    name: "Wireless Phone Charger",
    specType: "High-end",
    category: "Electronics",
    price: 34.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
    inStock: false, // Out of stock item
    rating: 3.8,
    backorder: true
  }
];