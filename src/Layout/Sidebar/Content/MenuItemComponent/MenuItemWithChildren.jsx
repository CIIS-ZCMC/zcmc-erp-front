import React, { useRef, useState } from "react";
import { Box, Stack, Typography, Divider, Sheet } from "@mui/joy";
import { ChevronDown, ChevronUp } from "lucide-react";

import MenuItemComponent from ".";
import ChildMenuItem from "./ChildMenuItem";
import ReactDOM from "react-dom";
import { useAuth } from "../../../../Store/AuthStore";

const MenuItemWithChildren = ({
  name,
  children,
  icon,
  path,
  isCollapsed,
  sidebarWidth,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoveringParent, setIsHoveringParent] = useState(false);
  const [isHoveringPopout, setIsHoveringPopout] = useState(false);

  const hideTimeoutRef = useRef(null);
  const parentRef = useRef(null); // Track DOM position of the item
  const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });

  // HOOKS
  const { permissions } = useAuth(); // Assuming useAuth provides the current user's permissions

  // Filter out children with assigned childPermissions
  const filteredChildren = children?.filter((child) => {
    if (child?.childPermissions && child?.childPermissions[0] === "*")
      return true; // No abilities means it's always accessible

    const hasPermission = child?.childPermissions?.some((permission) =>
      permissions.includes(permission)
    );

    return hasPermission;
  });

  const firstChild = filteredChildren[0]?.path;

  const headerItemStyles = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const handleClick = () => {
    if (!isCollapsed) setIsExpanded((prev) => !prev);
  };

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleParentMouseEnter = () => {
    clearHideTimeout();
    if (isCollapsed && parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setPopoutPosition({
        top: rect.top,
        left: rect.right,
      });
      setIsHoveringParent(true);
    }
  };

  const handleParentMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHoveringParent(false);
    }, 100);
  };

  const handlePopoutMouseEnter = () => {
    clearHideTimeout();
    setIsHoveringPopout(true);
  };

  const handlePopoutMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHoveringPopout(false);
    }, 100);
  };

  const showPopout = isHoveringParent || isHoveringPopout;

  const content = (
    <Box sx={headerItemStyles}>
      <Stack direction="row" alignItems="center">
        <Box>{icon}</Box>
        {!isCollapsed && (
          <Typography ml={1} color="white" fontSize={{ xs: 12, md: 13 }}>
            {name}
          </Typography>
        )}
      </Stack>
      {!isCollapsed && (isExpanded ? <ChevronUp /> : <ChevronDown />)}
    </Box>
  );

  return (
    <Box
      ref={parentRef}
      position="relative"
      onMouseEnter={handleParentMouseEnter}
      onMouseLeave={handleParentMouseLeave}
      sx={{
        py: isExpanded ? 0.5 : 0,
        borderRadius: "md",
        backgroundColor: isExpanded ? "rgba(255,255,255,0.05)" : "transparent",
        transition: "background-color 0.2s ease, padding 0.1s ease",
      }}
    >
      <MenuItemComponent onClick={handleClick} to={firstChild}>
        {content}
      </MenuItemComponent>
      {filteredChildren?.length > 1 ? (
        <Divider sx={{ mt: !isExpanded && 1, mx: 1.5 }} />
      ) : null}
      {/* Inline children for expanded sidebar */}
      {!isCollapsed && isExpanded && (
        <Stack spacing={1} my={isExpanded && 1} px={2}>
          {filteredChildren.map((child, index) => (
            <ChildMenuItem key={index} path={path} {...child} />
          ))}
        </Stack>
      )}{" "}
      {/* Hover popout menu for collapsed sidebar */}
      {isCollapsed &&
        showPopout &&
        ReactDOM.createPortal(
          <>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: `${sidebarWidth}px`, // start after the sidebar
                width: `calc(100vw - ${sidebarWidth}px)`,
                height: "100vh",
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 200,
                pointerEvents: "none", // so user can interact with the page behind
              }}
            />
            <Sheet
              variant="outlined"
              sx={{
                position: "fixed",
                top: `${popoutPosition.top}px`,
                left: `${popoutPosition.left}px`,
                p: 1.5,
                minWidth: 200,
                bgcolor: "background.body",
                boxShadow: "lg",
                borderRadius: "md",
                zIndex: 9999,
                opacity: showPopout ? 1 : 0,
                transform: showPopout ? "translateX(0)" : "translateX(-10px)",
                transition: "opacity 100ms ease, transform 100ms ease",
                pointerEvents: showPopout ? "auto" : "none", // prevent flickers when invisible
              }}
              onMouseEnter={handlePopoutMouseEnter}
              onMouseLeave={handlePopoutMouseLeave}
            >
              <Stack spacing={1}>
                {filteredChildren.map((child, index) => (
                  <ChildMenuItem
                    key={index}
                    path={path}
                    {...child}
                    isInPopout
                  />
                ))}
              </Stack>
            </Sheet>
          </>,
          document.body
        )}{" "}
    </Box>
  );
};

export default MenuItemWithChildren;
