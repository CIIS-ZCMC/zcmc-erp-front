import { Box } from "@mui/joy";
import {
  CheckCheck,
  CheckCircle,
  CircleX,
  CornerDownLeft,
  Hourglass,
  InfoIcon,
  LogOut,
  MessagesSquare,
  TriangleAlert,
} from "lucide-react";
import { getModeColorScheme } from "./ColorScheme";
import { ArrowRight } from "lucide-react";
import { Check, CheckOutlined, Clear, Close } from "@mui/icons-material";
// STATUS
export const getStatusIcon = (status, iconOnly) => {
  const iconMap = {
    submitted: <Hourglass size={13} />,
    pending: <Hourglass size={13} />,
    approved: <CheckOutlined size={13} />,
    rejected: <Clear size={13} />,
    received: <CheckCircle size={13} />,
    returned: <CornerDownLeft size={13} />,
    info: <InfoIcon />,
    200: <CheckCheck />,
    201: <CheckCheck />,
    success: <CheckCheck />,
    199: <MessagesSquare />,
    warning: <MessagesSquare />,
    400: <CircleX />,
    422: <CircleX />,
    error: <CircleX />,
    danger: <CircleX />,
    logout: <LogOut />,
    next: <ArrowRight size={16} />,
  };

  const icon = iconMap[status] || null;
  const { color = "gray", iconColor = "white" } =
    getModeColorScheme(status) || {};

  return iconOnly ? (
    icon
  ) : (
    <Box
      sx={{
        width: 50,
        height: 50,
        bgcolor: color,
        color: iconColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
      }}
    >
      {icon}
    </Box>
  );
};
