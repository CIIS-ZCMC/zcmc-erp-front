import { Outlet } from "react-router-dom";
import { Avatar, Box, Grid, Stack, useTheme } from "@mui/joy";
import Sidebar from "./Sidebar";
import useModalHook from "../Hooks/ModalHook";
import { Fragment } from "react";
import AlertDialogComponent from "../Components/Common/Dialog/AlertDialogComponent";
import NotificationMain from "../Components/Notification/NotificationMain";
import SnackbarComponent from "../Components/Common/SnackbarComponent";
import useSnackbarHook from "../Components/Common/SnackbarHook";

function Layout() {
  const theme = useTheme();
  const color = theme.palette.custom;

  const { alertDialogState } = useModalHook();
  const { isOpen: snackbarIsOpen } = useSnackbarHook();

  return (
    <Fragment>
      <Grid container sx={{ maxHeight: "100vh" }}>
        {/* Notification */}
        <Box position={"absolute"} right={10} p={4}>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <NotificationMain />
            <Avatar
              size="lg"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSphOILfuKHyTdMirb7TWHIfW_bB9-TKYLqEw&s"
              sx={{ border: 3, borderColor: "primary.500" }}
            />
          </Stack>
        </Box>
        {/* Sidebar */}
        <Grid
          item="true"
          xs={12} // Full width on extra small screens
          sm={4} // 4/12 width on small screens
          md={3} // 3/12 width on medium screens
          lg={2} // 2/12 width on large screens
          sx={{
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
            marginLeft: { sm: "33.33%", md: "25%", lg: "16.67%" }, // Adjust margin based on sidebar width
            // backgroundColor: color.lightBg,
            maxHeight: "100vh", // Ensure the main content area fills the screen
            overflowY: "hidden", // Allow scrolling if content overflows
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
