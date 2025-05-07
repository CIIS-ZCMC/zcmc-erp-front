import { Avatar, Badge, Box, Chip, Link, Stack, Typography } from "@mui/joy";
import { getModeColorScheme } from "../../Utils/ColorScheme";
import PropTypes from "prop-types";
import moment from "moment";
import { ExternalLink } from "lucide-react";

NotificationItemList.propTypes = { unread: PropTypes.bool };

function NotificationItemList({
  unread = true,
  title,
  description,
  profile_url,
  date,
  onClick,
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
        <Avatar src={profile_url} />
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
            {moment(date).fromNow()} &#9679; {moment(date).format("H:mm a")}
          </Typography>
          <Link
            fontSize={12}
            gap={0.67}
            textColor={"primary.500"}
            fontWeight={500}
          >
            Go to request <ExternalLink size={12} />
          </Link>
        </Stack>
      </Stack>{" "}
    </Stack>
  );
}

export default NotificationItemList;
