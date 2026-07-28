import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Stack,
  Typography,
  Sheet,
  Divider,
  Chip,
  Tooltip,
  Badge,
} from "@mui/joy";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import MenuItemComponent from ".";
import ChildMenuItem from "./ChildMenuItem";
import ReactDOM from "react-dom";
import { useSidebarBadgeStore } from "../../../../Hooks/SidebarBadgeHook";
import { useNotifications } from "../../../../Hooks/NotificationsHook";

const isPathActive = (currentPath, targetPath) => {
  if (!currentPath || !targetPath) return false;
  if (currentPath === targetPath) return true;
  return currentPath.startsWith(targetPath === "/" ? "/" : `${targetPath}/`);
};

const MenuItemWithChildren = ({
  name,
  childrenItems = [],
  icon,
  path,
  isCollapsed,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const manualBadges = useSidebarBadgeStore((state) => state.badges);
  const notifications = useNotifications();

  // Aggregate badge counts across all child routes
  const totalBadgeCount = useMemo(() => {
    return childrenItems.reduce((sum, child) => {
      const manualCount = manualBadges[child.path] || 0;
      const notifCount =
        notifications?.filter(
          (notif) =>
            notif.seen === 0 &&
            notif.module_path &&
            (notif.module_path === child.path ||
              notif.module_path.startsWith(`${child.path}/`)),
        ).length || 0;

      return sum + manualCount + notifCount;
    }, 0);
  }, [childrenItems, manualBadges, notifications]);

  // Determine if any child route is currently active
  const hasActiveChild = useMemo(() => {
    return childrenItems.some((child) => isPathActive(currentPath, child.path));
  }, [currentPath, childrenItems]);

  const [isExpanded, setIsExpanded] = useState(hasActiveChild);
  const [isHoveringParent, setIsHoveringParent] = useState(false);
  const [isHoveringPopout, setIsHoveringPopout] = useState(false);

  const hideTimeoutRef = useRef(null);
  const parentRef = useRef(null);
  const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });

  // Expand parent accordion when active child path is visited
  useEffect(() => {
    if (hasActiveChild && !isCollapsed) {
      setIsExpanded(true);
    }
  }, [hasActiveChild, isCollapsed]);

  const firstChildPath = childrenItems[0]?.path || path;

  const handleClick = useCallback(() => {
    if (!isCollapsed) setIsExpanded((prev) => !prev);
  }, [isCollapsed]);

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
        top: Math.max(10, rect.top - 4),
        left: rect.right + 8,
      });
      setIsHoveringParent(true);
    }
  };

  const handleParentMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHoveringParent(false);
    }, 120);
  };

  const handlePopoutMouseEnter = () => {
    clearHideTimeout();
    setIsHoveringPopout(true);
  };

  const handlePopoutMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsHoveringPopout(false);
    }, 120);
  };

  const showPopout = isHoveringParent || isHoveringPopout;

  const parentContent = (
    <Box
      ref={parentRef}
      position="relative"
      onMouseEnter={handleParentMouseEnter}
      onMouseLeave={handleParentMouseLeave}
      sx={{
        py: isExpanded && !isCollapsed ? 0.5 : 0,
        borderRadius: "md",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        width: "100%",
        boxSizing: "border-box",
        "&:hover": {
          backgroundColor: isCollapsed
            ? "rgba(255, 255, 255, 0.12)"
            : "transparent",
          transform: isCollapsed ? "scale(1.05)" : "none",
        },
      }}
    >
      {/* Active Left Indicator Pill when Collapsed */}
      {isCollapsed && hasActiveChild && (
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
        onClick={handleClick}
        to={firstChildPath}
        sx={{
          justifyContent: isCollapsed ? "center" : "flex-start",
          px: isCollapsed ? 1 : 1.5,
          py: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: isCollapsed ? "center" : "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" alignItems="center">
            {isCollapsed && totalBadgeCount > 0 ? (
              <Badge
                badgeContent={totalBadgeCount}
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
                    display: "flex",
                    alignItems: "center",
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
                  display: "flex",
                  alignItems: "center",
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
                color="white"
                fontSize={{ xs: 12, md: 13 }}
                fontWeight={hasActiveChild ? 600 : 400}
              >
                {name}
              </Typography>
            )}
          </Stack>

          {!isCollapsed && (
            <Stack direction="row" alignItems="center" spacing={1}>
              {totalBadgeCount > 0 && (
                <Chip
                  size="sm"
                  variant="solid"
                  color="warning"
                  sx={{
                    borderRadius: "lg",
                    px: 0.8,
                    minHeight: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    boxShadow: "0 2px 4px rgba(225, 29, 72, 0.4)",
                  }}
                >
                  {totalBadgeCount}
                </Chip>
              )}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Stack>
          )}
        </Box>
      </MenuItemComponent>

      {/* Inline children for expanded sidebar */}
      {!isCollapsed && isExpanded && (
        <Stack
          spacing={0.5}
          mt={0.5}
          mb={1}
          pl={1}
          pr={0}
          sx={{ width: "100%", boxSizing: "border-box" }}
        >
          {childrenItems.map((child) => (
            <ChildMenuItem
              key={child.path || child.name}
              path={path}
              {...child}
            />
          ))}
        </Stack>
      )}

      {/* Hover popout menu for collapsed sidebar */}
      {isCollapsed &&
        showPopout &&
        ReactDOM.createPortal(
          <>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(15, 23, 42, 0.15)",
                backdropFilter: "blur(3px)",
                zIndex: 200,
                pointerEvents: "none",
              }}
            />
            <Sheet
              variant="outlined"
              sx={{
                position: "fixed",
                top: `${popoutPosition.top}px`,
                left: `${popoutPosition.left}px`,
                p: 1.5,
                minWidth: 220,
                maxWidth: 280,
                bgcolor: "#003852",
                borderColor: "rgba(255, 255, 255, 0.2)",
                boxShadow:
                  "0 12px 30px -5px rgba(0, 0, 0, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.2)",
                borderRadius: "xl",
                zIndex: 9999,
                opacity: showPopout ? 1 : 0,
                transform: showPopout
                  ? "translateX(0) scale(1)"
                  : "translateX(-8px) scale(0.96)",
                transition: "opacity 120ms ease, transform 120ms ease",
                pointerEvents: showPopout ? "auto" : "none",
              }}
              onMouseEnter={handlePopoutMouseEnter}
              onMouseLeave={handlePopoutMouseLeave}
            >
              {/* Popout Header */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                px={0.5}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ color: "#38bdf8", fontSize: 18, display: "flex" }}>
                    {icon}
                  </Box>
                  <Typography
                    level="title-sm"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {name}
                  </Typography>
                </Stack>
                {totalBadgeCount > 0 ? (
                  <Chip
                    size="sm"
                    variant="solid"
                    color="danger"
                    sx={{
                      fontSize: 10,
                      minHeight: 18,
                      px: 0.8,
                      fontWeight: 700,
                    }}
                  >
                    {totalBadgeCount}
                  </Chip>
                ) : (
                  <Chip
                    size="sm"
                    variant="soft"
                    color="primary"
                    sx={{ fontSize: 10, minHeight: 18, px: 0.8 }}
                  >
                    {childrenItems.length}
                  </Chip>
                )}
              </Stack>
              <Divider
                sx={{ mb: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}
              />

              <Stack spacing={0.5}>
                {childrenItems.map((child) => (
                  <ChildMenuItem
                    key={child.path || child.name}
                    path={path}
                    {...child}
                    isInPopout
                  />
                ))}
              </Stack>
            </Sheet>
          </>,
          document.body,
        )}
    </Box>
  );

  if (isCollapsed && !showPopout) {
    return (
      <Tooltip title={name} placement="right" arrow size="sm">
        {parentContent}
      </Tooltip>
    );
  }

  return parentContent;
};

export default React.memo(MenuItemWithChildren);
