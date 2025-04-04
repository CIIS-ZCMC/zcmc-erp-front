import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CircularProgress } from "@mui/joy";

import { sidebarRoutes } from "./PageRoutes";
import Layout from "../Layout";
import ComponentTestPage from "../Pages/ComponentTestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Parent component that renders common layout
    children: sidebarRoutes, // Custom page routes
  },
  // {
  //     // path: "/releasing",
  //     element: <Layout />, // Parent component that renders common layout
  //     children: childrenRoutes, // Custom page routes
  // },
  {
    path: "/test-component",
    element: <ComponentTestPage />, // For testing component only
  },
  // {
  //     path: "/signing-in/:id",
  //     element: <Authentication />,
  // },
  // {
  //     path: "*",
  //     element: <PageNotFound />,
  // },
]);

const AnimatedRoutes = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AnimatedRoutes;
