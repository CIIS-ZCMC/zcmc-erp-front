import { Outlet } from "react-router-dom";
import { Box, Grid, useTheme } from "@mui/joy";
import Sidebar from "./Sidebar";

function Layout() {
  const theme = useTheme();
  const color = theme.palette.custom;

  return (
    <Grid container sx={{ maxHeight: "100vh" }}>
      {/* Sidebar */}
      <Grid
        item
        xs={12} // Full width on extra small screens
        sm={4} // 4/12 width on small screens
        md={3} // 3/12 width on medium screens
        lg={2} // 2/12 width on large screens
        sx={{
          position: "fixed", // Make sidebar fixed
          top: 0,
          left: 0,
          bottom: 0,
          height: "100vh",
          backgroundColor: color.main,
        }}
      >
        <Sidebar />
      </Grid>

      {/* Outlet is where the child routes will be rendered */}
      <Grid
        item
        xs={12} // Full width on extra small screens
        sm={8} // 8/12 width on small screens
        md={9} // 9/12 width on medium screens
        lg={10} // 10/12 width on large screens
        p={4}
        sx={{
          marginLeft: { sm: "33.33%", md: "25%", lg: "16.67%" }, // Adjust margin based on sidebar width
          backgroundColor: color.lightBg,
          height: "100vh", // Ensure the main content area fills the screen
          overflowY: "auto", // Allow scrolling if content overflows
        }}
      >
        <Box>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Layout;
