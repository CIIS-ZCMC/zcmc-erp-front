import React from "react";
import { Box, Typography, Tooltip, Badge, Chip, useTheme } from "@mui/joy";
import { useLocation } from "react-router-dom";
import MenuItemComponent from ".";
import { useRouteBadgeCount } from "../../../../Hooks/SidebarBadgeHook";

const SimpleMenuItem = ({ name, path, icon, isCollapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive =
    currentPath === path ||
    (path !== "/" && currentPath.startsWith(`${path}/`));
  const badgeCount = useRouteBadgeCount(path);

  const theme = useTheme();
  const color = theme.palette.custom;

  const menuItemBody = (
    <Box
      sx={{
        position: "relative",
        backgroundColor: isActive ? color.light : "transparent",
        borderRadius: "md",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "flex-start",
        width: "100%",
        "&:hover": {
          backgroundColor: isActive ? color.light : "rgba(255, 255, 255, 0.12)",
          transform: isCollapsed ? "scale(1.05)" : "none",
        },
      }}
    >
      {/* Active Left Indicator Pill when Collapsed */}
      {isCollapsed && isActive && (
        <Box
          sx={{
            position: "absolute",
            left: -4,
            top: "20%",
            bottom: "20%",
            width: "4px",
            borderRadius: "0 4px 4px 0",
            backgroundColor: "#38bdf8",
            boxShadow: "0 0 8px rgba(56, 189, 248, 0.8)",
          }}
        />
      )}

      <MenuItemComponent
        to={path}
        path={path}
        sx={{
          width: "100%",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: isCollapsed ? 1 : 1.5,
          py: 1,
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
          {isCollapsed && badgeCount > 0 ? (
            <Badge
              badgeContent={badgeCount}
              color="warning"
              size="sm"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                overflow: "visible",
                "& .MuiBadge-badge": {
                  top: 2,
                  right: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  border: "2px solid #003852",
                  fontSize: 10,
                  fontWeight: 700,
                },
              }}
            >
              <Box
                sx={{
                  fontSize: { xs: 18, md: 20 },
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {icon}
              </Box>
            </Badge>
          ) : (
            <Box
              sx={{
                fontSize: { xs: 18, md: 20 },
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                color: "white",
              }}
            >
              {icon}
            </Box>
          )}

          {!isCollapsed && (
            <Typography
              ml={1.5}
              textColor="white"
              fontSize={{ xs: 12, md: 14 }}
              fontWeight={isActive ? 600 : 400}
              noWrap
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {name}
            </Typography>
          )}
        </Box>

        {!isCollapsed && badgeCount > 0 && (
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
    </Box>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={name} placement="right" arrow size="sm">
        {menuItemBody}
      </Tooltip>
    );
  }

  return menuItemBody;
};

export default React.memo(SimpleMenuItem);
