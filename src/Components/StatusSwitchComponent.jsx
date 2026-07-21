import { Switch, Typography } from "@mui/joy";
import React from "react";

const switchSizes = {
  sm: {
    thumb: "14px",
    width: "65px",
    height: "22px",
    font: "body-xs",
    padding: 6,
  },
  md: {
    thumb: "17px",
    width: "80px",
    height: "26px",
    font: "body-sm",
    padding: 8,
  },
  lg: {
    thumb: "18px",
    width: "100px",
    height: "26px",
    font: "body-sm",
    padding: 10,
  },
};
export default function StatusSwitch({
  checked,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Archived",
  activeColor = "success",
  inactiveColor = "warning",
  activeBg,
  inactiveBg,
  disabled = false,
  size = "md",
}) {
  const isActive = checked;
  const config = switchSizes[size] || switchSizes.md;

  return (
    <Switch
      size={size}
      color={isActive ? activeColor : inactiveColor}
      checked={isActive}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      slotProps={{
        track: {
          children: (
            <>
              <Typography
                component="span"
                level={config.font}
                sx={{
                  position: "absolute",
                  left: config.padding,
                  color: "#fff",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              >
                {activeLabel}
              </Typography>

              <Typography
                component="span"
                level={config.font}
                sx={{
                  position: "absolute",
                  right: config.padding,
                  color: "#fff",
                  opacity: !isActive ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              >
                {inactiveLabel}
              </Typography>
            </>
          ),
        },
      }}
      sx={{
        "--Switch-thumbSize": config.thumb,
        "--Switch-trackWidth": config.width,
        "--Switch-trackHeight": config.height,

        "& .MuiSwitch-thumb": {
          transition: "transform 200ms ease",
        },
        "& .MuiSwitch-track": {
          transition: "background-color 200ms ease",
        },

        ...(isActive
          ? activeBg && {
              "--Switch-trackBackground": activeBg,
            }
          : inactiveBg && {
              "--Switch-trackBackground": inactiveBg,
              "--Switch-trackHoverBackground": inactiveBg,
            }),
      }}
    />
  );
}
