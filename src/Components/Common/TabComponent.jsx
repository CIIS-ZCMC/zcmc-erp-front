import { useEffect } from "react";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Badge, ListItemDecorator } from "@mui/joy";
import { useNotifications } from "../../Hooks/NotificationsHook";
// import useNotificationHook from "../../Hooks/NotificationHook";

export default function TabComponent({
  tabs,
  children,
  index,
  setIndex,
  notificationView = false,
  handleTabChange,
  bgcolor = "white",
  stickyHeader = false, // New prop for sticky header
  scrollableContent = false, // New prop for scrollable content
  height = "auto", // New prop for height control
}) {
  const notifications = useNotifications();

  const unreadCount = notifications?.filter(
    (element) => element.seen === 0,
  )?.length;

  useEffect(() => {
    if (index === undefined && tabs?.length) {
      setIndex(tabs[0].value ?? 0);
    }
  }, [tabs]);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "visible",
        display: stickyHeader || scrollableContent ? "flex" : "block",
        flexDirection: stickyHeader || scrollableContent ? "column" : "row",
        height: height,
      }}
    >
      <Tabs
        aria-label="Tabs"
        value={index}
        onChange={(event, value) => {
          handleTabChange ? handleTabChange(value) : setIndex(value);
        }}
        sx={{
          bgcolor: bgcolor,
          display: stickyHeader || scrollableContent ? "flex" : "block",
          flexDirection: stickyHeader || scrollableContent ? "column" : "row",
          height: stickyHeader || scrollableContent ? "100%" : "auto",
        }}
      >
        <TabList
          sx={{
            pt: 1,
            borderRadius: 0,
            fontSize: 14,
            ...(stickyHeader && {
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: bgcolor || "white",
            }),
            [`&& .${tabClasses.root}`]: {
              color: "primary.800",
              width: "auto",
              "&:hover": {
                bgcolor: "transparent",
              },
              [`&.${tabClasses.selected}`]: {
                color: "primary.700",
                fontWeight: 500,
                bgcolor: "transparent",
                "&::after": {
                  height: 3,
                },
              },
            },
          }}
        >
          {notificationView ? (
            <>
              <Tab value={0}>View all</Tab>
              <Tab value={1}>Read </Tab>
              <Tab value={2}>
                Unread
                {unreadCount > 0 ? (
                  <Chip
                    size="sm"
                    color="primary"
                    variant="solid"
                    sx={{ fontSize: 10 }}
                  >
                    {unreadCount}
                  </Chip>
                ) : (
                  ""
                )}
              </Tab>
            </>
          ) : (
            tabs?.map(({ name, id, value, icon }, key) => (
              <Tab key={key} value={value}>
                {icon && <ListItemDecorator>{icon}</ListItemDecorator>}

                {name}
              </Tab>
            ))
          )}
        </TabList>

        <TabPanel
          value={index}
          sx={{
            p: 0,
            ...(scrollableContent && {
              overflow: "visible",
              flex: 1,
              minHeight: 0,
            }),
          }}
        >
          {children}
        </TabPanel>
      </Tabs>
    </Box>
  );
}
