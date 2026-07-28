import React from "react";
import { Box, Typography, Chip } from "@mui/joy";
import { useLocation } from "react-router-dom";
import MenuItemComponent from ".";
import { useRouteBadgeCount } from "../../../../Hooks/SidebarBadgeHook";

const childIconStyles = {
  fontSize: { xs: 16, md: 20 },
  display: "flex",
  alignItems: "center",
};

const ChildMenuItem = ({ icon, name, path, isInPopout = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive =
    currentPath === path ||
    (path !== "/" && currentPath.startsWith(`${path}/`));
  const badgeCount = useRouteBadgeCount(path);

  return (
    <MenuItemComponent
      to={path}
      path={path}
      sx={{
        px: 1.5,
        py: 1.5,
        borderRadius: "md",
        transition: "background 0.2s",
        backgroundColor: isActive ? "#1E5978" : "transparent",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        ...(isInPopout
          ? {
              bgcolor: isActive ? "#006599" : "transparent",
              color: "white",
              "&:hover": {
                bgcolor: isActive ? "#006599" : "rgba(255, 255, 255, 0.15)",
                color: "white",
              },
            }
          : {
              "&:hover": {
                color: !isActive && "white",
                bgcolor: !isActive && "rgba(255,255,255,0.09)",
                transition: "background 0.2s",
              },
            }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        {icon && <Box sx={childIconStyles}>{icon}</Box>}
        <Typography
          ml={isInPopout ? (icon ? 1 : 0) : 1.5}
          fontSize={{ xs: 13 }}
          textColor={
            isInPopout
              ? isActive
                ? "white"
                : "rgba(255, 255, 255, 0.85)"
              : "white"
          }
          fontWeight={isActive ? 600 : 400}
          noWrap
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {name}
        </Typography>
      </Box>

      {badgeCount > 0 && (
        <Chip
          size="sm"
          variant="solid"
          color="warning"
          sx={{
            ml: 1,
            flexShrink: 0,
            borderRadius: "lg",
            px: 0.8,
            minHeight: 18,
            fontSize: 10,
            fontWeight: 700,
            boxShadow: "0 2px 4px rgba(225, 29, 72, 0.4)",
          }}
        >
          {badgeCount}
        </Chip>
      )}
    </MenuItemComponent>
  );
};

export default React.memo(ChildMenuItem);
