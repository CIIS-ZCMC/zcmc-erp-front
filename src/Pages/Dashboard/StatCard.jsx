import IconButtonComponent from "@Components/Common/IconButtonComponent";
import { Box, Typography, Stack } from "@mui/joy";
import { grey } from "@mui/material/colors";

export default function DashboardStatCard({
  icon,
  value,
  label,
  subLabel,
  percentage,
  bg = "#fff",
  gradient,
  textColor = "#006599",
  iconBg = "#E6F4FF",
  iconColor,
  borderRadius = 16,
  height = 115,
  subTxtcolor,
  withBorderLeft = false,
  topLabel,
}) {
  return (
    <Box
      sx={{
        width: "91%",
        height,
        borderRadius,
        background: gradient ? gradient : bg,
        paddingX: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        boxShadow: "0 4px 12px rgba(13, 13, 13, 0.1)",
        borderLeft: withBorderLeft && `6px solid ${textColor}`,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButtonComponent
          icon={icon}
          color={iconColor}
          variant={"soft"}
          size={"lg"}
          withBorderRadius
        />
        <Stack>
          {topLabel && topLabel}
          {/* Value or Percentage */}
          <Typography level="h2" sx={{ color: textColor, fontWeight: 600 }}>
            {percentage ? `${percentage}%` : value}
          </Typography>

          {/* Label */}
          <Typography
            level="body-sm"
            sx={{ color: grey[800], opacity: 0.9, lineHeight: 0.8 }}
          >
            {label}
          </Typography>

          {/* Sub text */}
          {subLabel && subLabel}
        </Stack>
      </Stack>
    </Box>
  );
}
