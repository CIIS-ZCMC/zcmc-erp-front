import { Outlet } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import Sidebar from "./Sidebar";
import useModalHook from "../Hooks/ModalHook";
import { Fragment, useEffect, useState } from "react";
import AlertDialogComponent from "../Components/Common/Dialog/AlertDialogComponent";
import useSidebarHook from "../Hooks/SidebarHook";
import { useMediaQuery } from "@mui/material";
import NotificationMain from "../Components/Notification/NotificationMain";
import SnackbarComponent from "../Components/Common/SnackbarComponent";
import useSnackbarHook from "../Components/Common/SnackbarHook";
import { useAuth } from "../Store/AuthStore";

function Layout() {
  const theme = useTheme();
  const color = theme.palette.custom;

  const { alertDialogState } = useModalHook();
  const { isOpen: snackbarIsOpen } = useSnackbarHook();
  const { user } = useAuth();
  const profile_url = user?.profile_url || null;

  const { isCollapsed, toggleSidebar, setCollapsed } = useSidebarHook();
  const isSmallScreen = useMediaQuery("(max-width:1500px)");

  useEffect(() => {
    setCollapsed(isSmallScreen); // Auto-collapse if small screen
  }, [isSmallScreen, setCollapsed]);
  return (
    <Fragment>
      <Grid container sx={{ maxHeight: "100vh" }}>
        {/* Notification */}
        <Box position={"absolute"} right={10} p={4}>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <NotificationMain />
            {profile_url ? (
              <Avatar
                size="lg"
                src={profile_url}
                sx={{ border: 3, borderColor: "primary.500", bgColor: "white" }}
              />
            ) : (
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <Avatar
                  sx={{
                    border: 5,
                    borderColor: "primary.200",
                    bgColor: "white",
                  }}
                  variant="solid"
                  color="primary"
                >
                  {user?.name[0]}
                </Avatar>
                <Stack>
                  <Typography fontWeight={"bold"}> {user?.name}</Typography>
                  <Typography level="body-xs"> {user?.email}</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Box>
        {/* Sidebar */}
        <Grid
          item="true"
          xs={12}
          sm={isCollapsed ? 1.2 : 4}
          md={isCollapsed ? 0.8 : 3}
          lg={isCollapsed ? 0.7 : 2}
          xl={isCollapsed ? 0.7 : 2}
          sx={{
            transition: "width 0.3s",
            position: "fixed", // Make sidebar fixed
            top: 0,
            left: 0,
            bottom: 0,
            maxHeight: "100vh",
            backgroundColor: color.main,
          }}
        >
          <Sidebar />
        </Grid>

        {/* Outlet is where the child routes will be rendered */}
        <Grid
          item="true"
          xs={12}
          sm={isCollapsed ? 10.8 : 8}
          md={isCollapsed ? 11.2 : 9}
          lg={isCollapsed ? 11.3 : 10}
          xl={isCollapsed ? 11.4 : 10}
          p={3}
          sx={{
            // marginLeft: { sm: "33.33%", md: "25%", lg: "16.67%" }, // Adjust margin based on sidebar width
            marginLeft: {
              sm: isCollapsed ? "8.33%" : "33.33%",
              md: isCollapsed ? "7.66%" : "25%",
              lg: isCollapsed ? "6.80%" : "16.67%",
              xl: isCollapsed ? "5.77%" : "16.77%",
            },
            transition: "margin-left 0.3s",
            // backgroundColor: color.lightBg,
            maxHeight: "100vh", // Ensure the main content area fills the screen
            // overflowY: "auto", // Allow scrolling if content overflows
          }}
        >
          <Box>
            <Outlet />
          </Box>
        </Grid>
      </Grid>
      {/*  AlertDialog Modal for global display; isGlobal is true by default */}
      {alertDialogState.isGlobal && <AlertDialogComponent />}

      {snackbarIsOpen && <SnackbarComponent />}
    </Fragment>
  );
}

export default Layout;
