// Routes/AnimatedRoutes.js

import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CircularProgress } from "@mui/joy";

import { sidebarRoutes } from "./PageRoutes";
import Layout from "../Layout";
import Authentication from "../Pages/Authentication";
import ProtectedRoutes from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Layout />
      </ProtectedRoutes>
    ),
    children: sidebarRoutes,
  },
  {
    path: "/signing-in/:id",
    element: <Authentication />,
  },
]);

const AnimatedRoutes = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AnimatedRoutes;
