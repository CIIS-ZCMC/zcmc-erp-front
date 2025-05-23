import React, { useRef, useState } from "react";
import { Box, Stack, Typography, Divider, Sheet } from "@mui/joy";
import { ChevronDown, ChevronUp } from "lucide-react";

import MenuItemComponent from ".";
import ChildMenuItem from "./ChildMenuItem";
import ReactDOM from "react-dom";

const headerItemStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  width: "100%",
};

const MenuItemWithChildren = ({ name, children, icon, path, isCollapsed }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHoveringParent, setIsHoveringParent] = useState(false);
  const [isHoveringPopout, setIsHoveringPopout] = useState(false);

  const hideTimeoutRef = useRef(null);
  const parentRef = useRef(null); // Track DOM position of the item
  const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });

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
          <Typography ml={1} color="white" fontSize={{ xs: 12, md: 14 }}>
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
    >
      <MenuItemComponent onClick={handleClick}>{content}</MenuItemComponent>

      {/* Inline children for expanded sidebar */}
      {!isCollapsed && isExpanded && (
        <Stack spacing={1.5}>
          {children.map((child, index) => (
            <ChildMenuItem key={index} path={path} {...child} />
          ))}
        </Stack>
      )}

      {/* Hover popout menu for collapsed sidebar */}
      {isCollapsed &&
        showPopout &&
        ReactDOM.createPortal(
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
              // ✨ Animation styles:
              opacity: showPopout ? 1 : 0,
              transform: showPopout ? "translateX(0)" : "translateX(-10px)",
              transition: "opacity 100ms ease, transform 100ms ease",
              pointerEvents: showPopout ? "auto" : "none", // prevent flickers when invisible
            }}
            onMouseEnter={handlePopoutMouseEnter}
            onMouseLeave={handlePopoutMouseLeave}
          >
            <Stack spacing={1}>
              {children.map((child, index) => (
                <ChildMenuItem key={index} path={path} {...child} isInPopout />
              ))}
            </Stack>
          </Sheet>,
          document.body
        )}

      <Divider />
    </Box>
  );
};

export default MenuItemWithChildren;
