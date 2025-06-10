import React, { Fragment, useEffect, useMemo, useState } from "react";
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
import TabComponent from "../Common/TabComponent";
import NotificationItemList from "./NotificationItemList";
import NoNotification from "./NoNotification";
import ContainerComponent from "../Common/ContainerComponent";
import {
  useNotificationEvents,
  useNotifications,
} from "../../Hooks/NotificationsHook";
import { groupByDate } from "../../Utils/GroupData";
import moment from "moment";
import ButtonComponent from "../Common/ButtonComponent";
import { socket } from "../../Services/Socket";
import { playNotificationSound } from "../../Utils/NotificationSound";
import { toast } from "sonner";
import notif from "../../assets/notif.mp3";

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

  // NOTIFICATION TOAST
  const notify = (title, description, module_path) => {
    playNotificationSound(notif);

    // Pass the toast ID to the custom toast component
    const toastId = toast.info(() => (
      <div>
        <Stack>
          <Typography fontSize={13} fontWeight={600} color="primary">
            {title}
          </Typography>
          <Typography fontSize={11} fontWeight={400}>
            {description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2} mt={2}>
            <ButtonComponent
              label="Click to view"
              // onClick={() => handleClickView(toastId, module_path)}
              size="sm"
              variant="outlined"
              color={"neutral"}
              endDecorator={<IoOpenOutline />}
            />
            <Link
              fontSize={12}
              // onClick={() => handleMaybeLater(toastId)}
              sx={{ color: "primary.700", textDecoration: "underline" }}
            >
              Maybe later
            </Link>
          </Stack>
        </Stack>
      </div>
    ));
  };

  const handleOpenNotif = (id, module_path) => {
    // seen(id, () => {
    //   localStorageSetter("path", module_path);
    //   window.location.href = module_path;
    // });
  };

  const handleMarkAllAsRead = () => {
    // if (employee_profile_id)
    //   markAllAsRead(employee_profile_id, (status, message) => {
    //     if (status === 200) {
    //       closeAlert();
    //       openDrawer();
    //       handleClickDrawer();
    //       toast.success(message);
    //     }
    //   });
  };

  const openAlert = () => {
    // return handleAlert(
    //   422,
    //   "Mark all as read",
    //   "Are you sure you want to mark all the items as read?"
    // );
  };

  // Start listening for new notifications via socket
  useNotificationEvents();

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
        {notifications?.length > 0 ? (
          <Badge
            badgeContent={notifications?.length}
            size="sm"
            color="primary"
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
            width: { sm: "80vw", md: "50vw", lg: "30vw" },
            position: "absolute",
            right: 87,
            top: 85,
            zIndex: 100,
          }}
        >
          <ContainerComponent title={"Notifications"}>
            <Stack gap={2}>
              <TabComponent index={index} setIndex={setIndex} notificationView>
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
