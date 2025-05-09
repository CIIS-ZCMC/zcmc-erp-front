import * as React from "react";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Badge } from "@mui/joy";
// import useNotificationHook from "../../Hooks/NotificationHook";

export default function TabComponent({
  tabs,
  children,
  index,
  setIndex,
  notificationView = false,
}) {
  const unreadCount = 12;

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowX: "hidden",
      }}
    >
      <Tabs
        aria-label="Pipeline"
        value={index}
        onChange={(event, value) => setIndex(value)}
        sx={{ bgcolor: "white" }}
      >
        <TabList
          sx={{
            pt: 1,
            borderRadius: 0,
            fontSize: 14,
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
                Unread{" "}
                <Chip
                  size="sm"
                  color="primary"
                  variant="solid"
                  sx={{ fontSize: 10 }}
                >
                  {unreadCount}
                </Chip>
              </Tab>
            </>
          ) : (
            tabs?.map(({ name, value }, key) => (
              <Tab key={key} value={value}>
                {name}
              </Tab>
            ))
          )}
        </TabList>
        <Box>
          <TabPanel value={index} sx={{ p: 0 }}>
            {children}
          </TabPanel>
        </Box>
      </Tabs>
    </Box>
  );
}
