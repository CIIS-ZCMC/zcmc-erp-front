import { Stack, useTheme } from "@mui/joy";
// import { sidebarRoutes } from "../Routes/PageRoutes";
import { useLocation } from "react-router-dom";

// layouts
import Header from "./Sidebar/Header";
import Content from "./Sidebar/Content";
import Footer from "./Sidebar/Footer";
import useSidebarHook from "../Hooks/SidebarHook";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { isCollapsed, toggleSidebar } = useSidebarHook();

  return (
    <Stack
      p={isCollapsed ? 2 : { xs: 1.5, sm: 2.5 }} // Responsive padding
      sx={{
        height: "95%",
        overflowY: "auto",
        alignItems: isCollapsed ? "center" : "flex-start",
      }} // Ensure it scrolls if needed
    >
      <Header />
      <Content />
      <Footer />
    </Stack>
  );
}

export default Sidebar;
