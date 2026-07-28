import React from "react";
import { Stack } from "@mui/joy";

// layouts
import Header from "./Sidebar/Header";
import Content from "./Sidebar/Content";
import Footer from "./Sidebar/Footer";
import useSidebarHook from "../Hooks/SidebarHook";

function Sidebar() {
  const { isCollapsed } = useSidebarHook();

  return (
    <Stack
      p={isCollapsed ? 1.5 : { xs: 1.5, sm: 2 }}
      sx={{
        height: "100%",
        maxHeight: "100vh",
        boxSizing: "border-box",
        overflowY: "hidden",
        alignItems: isCollapsed ? "center" : "stretch",
        zIndex: 250,
      }}
    >
      <Header />
      <Content />
      <Footer />
    </Stack>
  );
}

export default React.memo(Sidebar);
