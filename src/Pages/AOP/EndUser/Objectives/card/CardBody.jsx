import { Box, Stack, Tooltip, Typography } from "@mui/joy";

import InputComponent from "@Components/Form/InputComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { grey } from "@mui/material/colors";

const CardBody = ({
  status,
  success_indicator,
  other_objective,
  objective,
  other_success_indicator,
  type_of_function,
}) => {
  if (!objective && !other_objective) {
    return <ThreeDotsLoader />;
  }

  const objectiveText = objective?.is_other
    ? other_objective?.description
    : objective?.description;

  const successIndicatorText = success_indicator?.is_other
    ? other_success_indicator?.description
    : success_indicator?.description;

  const ellipsisText = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    cursor: "pointer",
  };

  const popupStyle = {
    display: "none",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bgcolor: "#F2F2F2",
    borderRadius: 10,
    p: 1.5,
    boxShadow: "lg",
    zIndex: 9999,
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      width="100%"
      gap={2}
      sx={{
        position: "relative",
        // CHANGE 1: Change baseline from 2 to 10 so it naturally beats ChipComponent's zIndex: 1
        zIndex: 10,

        "&:hover": {
          // CHANGE 2: Bump up significantly to cover any nearby structural elements
          zIndex: 9999,
        },
      }}
    >
      <Stack
        width="100%"
        sx={{
          textAlign: "left",
          position: "relative",

          "&:hover .objectivePopup": {
            display: "block",
          },
        }}
      >
        <Typography
          level="title-md"
          sx={{
            fontWeight: 600,
            color: grey[900],
            ...ellipsisText,
          }}
        >
          {objectiveText}
        </Typography>

        <Box className="objectivePopup" sx={popupStyle}>
          <Typography
            level="title-md"
            sx={{
              fontWeight: 600,
              color: grey[900],
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {objectiveText}
          </Typography>
        </Box>
      </Stack>

      <Stack
        className="successWrapper"
        width="100%"
        sx={{
          textAlign: "left",
          bgcolor: "#F2F2F2",
          borderRadius: 10,
          p: 1.5,
          position: "relative",
          overflow: "hidden",

          "&:hover": {
            overflow: "visible",
          },

          "&:hover .successPopup": {
            display: "block",
          },

          "&:hover .successText": {
            visibility: "hidden",
          },
        }}
      >
        <Typography level="body-sm">Success Indicator</Typography>
        <Typography
          className="successText"
          level="title-md"
          sx={{
            color: grey[800],
            ...ellipsisText,
          }}
        >
          {successIndicatorText}
        </Typography>

        <Box className="successPopup" sx={popupStyle}>
          <Typography level="body-sm">Success Indicator</Typography>

          <Typography
            level="title-md"
            sx={{
              color: grey[800],
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {successIndicatorText}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default CardBody;
