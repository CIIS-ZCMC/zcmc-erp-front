import React, { Fragment, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Box,
  Button,
  Divider,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import TabComponent from "./TabComponent";
import NotificationItemList from "./NotificationItemList";
import NoNotification from "./NoNotification";
import ContainerComponent from "../Common/ContainerComponent";
import { useNotifications } from "../../Hooks/NotificationsHook";
import { groupByDate } from "../../Utils/GroupData";
import moment from "moment";
import ButtonComponent from "../Common/ButtonComponent";

const NotificationMain = ({ unread = 2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const notifications = useNotifications();

  const notificationsDisplay = useMemo(() => {
    let dataToDisplay = [];

    switch (index) {
      case 0: // ALL
        dataToDisplay = notifications;
        break;

      case 1: // SEEN
        dataToDisplay = notifications?.filter((element) => element.seen === 1);
        break;

      case 2: // UNREAD
        dataToDisplay = notifications?.filter((element) => element.seen === 0);
        break;
    }

    return groupByDate(dataToDisplay);
  }, [index, notifications]);

  const handleClickNotif = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <Fragment>
      <Box
        onClick={handleClickNotif}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1.5}
        sx={{
          cursor: "pointer",
          border: 1,
          borderColor: "neutral.300",
          borderRadius: 8,
          backgroundColor: "white",
          px: 1.4,
          height: 44,
          width: "auto",
        }}
      >
        {unread > 0 ? (
          <Badge
            badgeContent={unread ?? ""}
            size="sm"
            color="success"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Bell size={18} />
          </Badge>
        ) : (
          <Bell size={18} />
        )}

        <Typography fontSize={14}>Notifications</Typography>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Box>

      {/* NOTIFICATION CONTAINER */}
      {isOpen && (
        <Sheet
          sx={{
            mt: 1,
            height: "auto",
            borderRadius: 10,
            boxShadow: "xl",
            bgcolor: "white",
            width: "29vw",
            position: "absolute",
            right: 87,
            top: 85,
            zIndex: 100,
          }}
        >
          <ContainerComponent title={"Notifications"}>
            <Stack gap={2}>
              <TabComponent index={index} setIndex={setIndex}>
                <Stack
                  gap={0.5}
                  sx={{
                    mt: 2,
                    maxHeight: "50vh",
                    overflowY: "auto",
                    p: 1,
                    border: 1,
                    borderColor: "neutral.100",
                    borderRadius: 8,
                  }}
                >
                  {Object.keys(notificationsDisplay)?.length === 0 && (
                    <NoNotification />
                  )}
                  {Object.entries(notificationsDisplay).map(
                    ([date, messages]) => (
                      <Fragment key={date}>
                        {date !== moment().format("dddd, MMMM D") && (
                          <Divider
                            sx={{ fontSize: "xs", fontWeight: 600, my: 1 }}
                          >
                            {date}
                          </Divider>
                        )}

                        {messages?.map(
                          (
                            {
                              id,
                              profile_url,
                              title,
                              description,
                              created_at,
                              module_path,
                              seen,
                            },
                            key
                          ) => (
                            <NotificationItemList
                              key={key}
                              profile_url={profile_url}
                              //   onClick={() => handleOpenNotif(id, module_path)}
                              title={title}
                              description={description}
                              date={created_at}
                              module_path={module_path}
                              unread={seen === 0 && true}
                            />
                          )
                        )}
                      </Fragment>
                    )
                  )}
                </Stack>
              </TabComponent>

              <Divider />

              <Box>
                {" "}
                <ButtonComponent
                  color="primary"
                  label={"Mark all as read"}
                  variant={"outlined"}
                />
              </Box>
            </Stack>
          </ContainerComponent>
        </Sheet>
      )}
    </Fragment>
  );
};

NotificationMain.propTypes = {};

export default NotificationMain;
