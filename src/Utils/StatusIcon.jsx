import { Box } from "@mui/joy";
import {
  CheckCheck,
  CheckCircle,
  CircleX,
  CornerDownLeft,
  InfoIcon,
  MessagesSquare,
  TriangleAlert,
} from "lucide-react";
import { getModeColorScheme } from "./ColorScheme";
// STATUS
export const getStatusIcon = (status, iconOnly) => {
  const iconMap = {
    approved: <CheckCircle size={13} />,
    returned: <CornerDownLeft size={13} />,
    info: <InfoIcon />,
    200: <CheckCheck />,
    201: <CheckCheck />,
    success: <CheckCheck />,
    199: <MessagesSquare />,
    warning: <MessagesSquare />,
    400: <CircleX />,
    error: <CircleX />,
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
