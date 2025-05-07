import { Outlet } from "react-router-dom";
import { Box, Grid, useTheme } from "@mui/joy";
import Sidebar from "./Sidebar";
import useModalHook from "../Hooks/ModalHook";
import { Fragment, useState } from "react";
import AlertDialogComponent from "../Components/Common/Dialog/AlertDialogComponent";
import useSidebarHook from "../Hooks/SidebarHook";

function Layout() {
  const theme = useTheme();
  const color = theme.palette.custom;

  const { alertDialogState } = useModalHook();

  const { isCollapsed, toggleSidebar } = useSidebarHook();

  return (
    <Fragment>
      <Grid container sx={{ maxHeight: "100vh" }}>
        {/* Sidebar */}
        <Grid
          item="true"
          // xs={12} // Full width on extra small screens
          // sm={4} // 4/12 width on small screens
          // md={3} // 3/12 width on medium screens
          // lg={2} // 2/12 width on large screens
          sx={{
            width: isCollapsed
              ? "60px"
              : { xs: "100%", sm: "33.33%", md: "25%", lg: "16.67%" },
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
          xs={12} // Full width on extra small screens
          sm={8} // 8/12 width on small screens
          md={9} // 9/12 width on medium screens
          lg={10} // 10/12 width on large screens
          p={3}
          sx={{
            // marginLeft: { sm: "33.33%", md: "25%", lg: "16.67%" }, // Adjust margin based on sidebar width
            marginLeft: isCollapsed
              ? "60px"
              : { sm: "33.33%", md: "25%", lg: "16.67%" },
            transition: "margin-left 0.3s",
            // backgroundColor: color.lightBg,
            maxHeight: "100vh", // Ensure the main content area fills the screen
            overflowY: "auto", // Allow scrolling if content overflows
          }}
        >
          <Box>
            <Outlet />
          </Box>
        </Grid>
      </Grid>
      {/*  AlertDialog Modal for global display; isGlobal is true by default */}
      {alertDialogState.isGlobal && <AlertDialogComponent />}
    </Fragment>
  );
}

export default Layout;
