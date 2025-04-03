import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CircularProgress } from "@mui/joy";

import { sidebarRoutes } from "./PageRoutes";
import Layout from "../Layout";
import ComponentTestPage from "../Pages/ComponentTestPage";
import useModalHook from "../Hooks/ModalHook";
import AlertDialogComponent from "../Components/Common/Dialog/AlertDialogComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Parent component that renders common layout
    children: sidebarRoutes, // Custom page routes
  },
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
  const { alertDialogState } = useModalHook(); // Remove this later, use this in the Layout component

  return (
    <Suspense fallback={<CircularProgress />}>
      <RouterProvider router={router} />

      {/*  AlertDialog Modal for global display; isGlobal is true by default */}
      {alertDialogState.isGlobal && <AlertDialogComponent />}
    </Suspense>
  );
};

export default AnimatedRoutes;
