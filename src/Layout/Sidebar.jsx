import { Stack, useTheme } from "@mui/joy";
// import { sidebarRoutes } from "../Routes/PageRoutes";
import { useLocation } from "react-router-dom";

// layouts
import Header from "./Sidebar/Header";
import Content from "./Sidebar/Content";
import Footer from "./Sidebar/Footer";

function Sidebar() {


  const location = useLocation()
  const currentPath = location.pathname

  return (
    <Stack
      p={{ xs: 1.5, sm: 2.5 }} // Responsive padding
      sx={{ height: "95%", overflowY: "auto" }} // Ensure it scrolls if needed
    >
      <Header />
      <Content />
      <Footer />

    </Stack >
  );
}

export default Sidebar;

