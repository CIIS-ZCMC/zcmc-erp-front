import { Avatar, Badge, Box, Chip, Link, Stack, Typography } from "@mui/joy";
import PropTypes from "prop-types";
import moment from "moment";
import { ExternalLink } from "lucide-react";

NotificationItemList.propTypes = { unread: PropTypes.bool };

function NotificationItemList({
  unread = true,
  title,
  description,
  date,
  onClick,
  module_path,
}) {
  return (
    <Stack
      direction={"row"}
      spacing={1}
      sx={{
        padding: 2,
        borderRadius: 8,
        "&:hover": {
          // cursor: "pointer",
          bgcolor: "neutral.100",
        },
      }}
      alignItems={"start"}
      borderRadius={0}
      onClick={onClick}
    >
      <Box>
        <Avatar />
      </Box>
      <Stack gap={1} width="100%">
        <Stack gap={0.1}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <Typography
              fontWeight={unread ? 600 : 400}
              fontSize={13}
              textColor="primary.500"
            >
              {title}
            </Typography>{" "}
            {unread && <Badge sx={{ mt: 1 }} color="danger" size="sm" />}
          </Stack>

          <Typography fontWeight={400} textColor={"neutral.500"} fontSize={13}>
            {description}
          </Typography>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography fontWeight={400} textColor={"neutral.500"} fontSize={11}>
            {moment(date).fromNow()} • {moment(date).format("h:mm a")}
          </Typography>
          <Link
            fontSize={12}
            gap={0.67}
            textColor={"primary.500"}
            fontWeight={500}
            // href={module_path}
          >
            Go to request <ExternalLink size={12} />
          </Link>
        </Stack>
      </Stack>{" "}
    </Stack>
  );
}

export default NotificationItemList;
