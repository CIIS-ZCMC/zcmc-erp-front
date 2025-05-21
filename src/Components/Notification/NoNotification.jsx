import no_notif from "../../assets/no-notifications.jpg";
import { Stack, Typography } from "@mui/joy";
import PropTypes from "prop-types";

NoNotification.propTypes = {
  size: PropTypes.string,
};

function NoNotification({ size }) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      my={size === "xs" ? 0 : 2}
    >
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        my={size === "xs" ? 0 : 2}
      >
        <img
          src={no_notif}
          alt="Not found"
          style={{ width: size === "xs" ? 140 : 200 }}
        />
        <Typography fontSize={size === "xs" ? 15 : 17} fontWeight={600}>
          No notifications available
        </Typography>
        <Typography
          my={1}
          color={"neutral"}
          fontSize={13}
          fontWeight={300}
          width={"65%"}
          textAlign={"center"}
        >
          You have no notifications right now. We'll noitify you when there is
          something new
        </Typography>
      </Stack>
    </Stack>
  );
}

export default NoNotification;
