import { Drawer, styled } from "@mui/joy";

const SidebarRoot = styled(Drawer)(({ theme, ownerState }) => {
  const miniSidebar = ownerState;

  // Safeguard: Ensure transitions is available in the theme
  const transitions = theme.transitions || {
    create: () => ({}), // Fallback in case transitions is not defined
    easing: { sharp: "cubic-bezier(0.4, 0, 0.2, 1)" },
    duration: { shorter: 150 },
  };

  const drawerOpenStyles = () => ({
    transition: transitions.create("width", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    width: 270,
  });

  const drawerCloseStyles = () => ({
    transition: transitions.create("width", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),
    overflowX: "hidden",
    overflowY: "hidden",
    transform: "translateX(0)",
    width: 68,
  });

  return {
    "& .MuiBox": {
      overflowX: "hidden",
      maxHeight: "93vh",
      background: "red",
      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      borderRight: `1px solid white`,
      marginTop: 65,
      ...(miniSidebar ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});

export default SidebarRoot;
