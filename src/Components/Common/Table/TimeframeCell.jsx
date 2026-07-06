import { Stack, Typography } from "@mui/joy";
import moment from "moment";

export const TimeframeCell = ({ label, value }) => {
  if (!value) return <Typography>-</Typography>;

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        bgcolor: "#F5F5F5",
        borderRadius: "8px",
        px: 1.5,
        py: 1,
        width: "100%",
      }}
    >
      <Stack>
        <Typography
          level="body-sm"
          sx={{ fontSize: 11, color: "text.tertiary" }}
        >
          {label}
        </Typography>
        <Typography level="title-sm">{value}</Typography>
      </Stack>
    </Stack>
  );
};
