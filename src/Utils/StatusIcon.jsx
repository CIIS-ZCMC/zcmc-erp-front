import { Box } from "@mui/joy";
import {
  CheckCheck,
  CircleX,
  MessagesSquare,
  TriangleAlert,
} from "lucide-react";
import { getModeColorScheme } from "./ColorScheme";
// STATUS
export const getStatusIcon = (status) => {
  let icon = "";

  switch (status) {
    // SUCCESS
    case 200:
      icon = <CheckCheck />;
      break;
    case 201:
      icon = <CheckCheck />;
      break;
    case "success":
      icon = <CheckCheck />;
      break;

    // WARNING
    case 199:
      icon = <MessagesSquare />;
      break;
    case "warning":
      icon = <MessagesSquare />;
      break;

    // ERROR
    case 400:
      icon = <CircleX />;
      break;
    case "error":
      icon = <CircleX />;
      break;

    default:
      icon = null;
      break;
  }

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        bgcolor: getModeColorScheme(status).color,
        color: getModeColorScheme(status).iconColor,
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
