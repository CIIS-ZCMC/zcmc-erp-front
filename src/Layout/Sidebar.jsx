import { Stack, useTheme } from "@mui/joy";
// import { sidebarRoutes } from "../Routes/PageRoutes";
import { useLocation } from "react-router-dom";

// layouts
import Header from "./Sidebar/Header";
import Content from "./Sidebar/Content";
import Footer from "./Sidebar/Footer";
import useSidebarHook from "../Hooks/SidebarHook";
import { useRef } from "react";
import useResizeObserver from "../Hooks/useResizeObserver";

function Sidebar() {
  const sidebarRef = useRef();
  const sidebarSize = useResizeObserver(sidebarRef);
  const sidebarWidth = sidebarSize.width || 240;
  const location = useLocation();
  const currentPath = location.pathname;

  const { isCollapsed, toggleSidebar } = useSidebarHook();

  return (
    <Stack
      ref={sidebarRef}
      p={isCollapsed ? 2 : { xs: 1.5, sm: 2.5 }} // Responsive padding
      sx={{
        height: "95%",
        overflowY: "visible",
        alignItems: isCollapsed ? "center" : "flex-start",
        zIndex: 250,
      }} // Ensure it scrolls if needed
    >
      <Header />
      <Content sidebarWidth={sidebarWidth} />
      <Footer />
    </Stack>
  );
}

export default Sidebar;
