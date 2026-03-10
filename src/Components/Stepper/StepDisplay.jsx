import { Stack, Typography } from "@mui/joy";
import PropTypes from "prop-types";

StepTextDisplay.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  isRed: PropTypes.bool,
  isWarning: PropTypes.bool,
  turnaround: PropTypes.string,
};

function StepTextDisplay({ label, value, isRed, isWarning, turnaround }) {
  return (
    <Stack
      gap={0.5}
      direction={{ xs: "column", sm: "row" }}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: "start", sm: "center" },
      }}
    >
      <Typography level="body-xs" fontWeight={400}>
        {label ?? "Label"}
      </Typography>
      <Typography
        level="body-xs"
        color={isRed ? "danger" : isWarning ? "warning" : " "}
        fontWeight={isRed || isWarning ? 600 : ""}
      >
        {value ?? "-"}
      </Typography>
      {turnaround && (
        <Typography level="body-xs" color="neutral" fontWeight={400}>
          {turnaround}
        </Typography>
      )}
    </Stack>
  );
}

export default StepTextDisplay;
