import { Switch, Typography } from "@mui/joy";
import React from "react";

const switchSizes = {
  sm: {
    thumb: "14px",
    width: "75px",
    height: "22px",
    font: "body-xs",
    padding: 8,
  },
  md: {
    thumb: "17px",
    width: "100px",
    height: "26px",
    font: "body-sm",
    padding: 12,
  },
  lg: {
    thumb: "22px",
    width: "130px",
    height: "34px",
    font: "body-md",
    padding: 16,
  },
};

export default function StatusSwitch({
  checked,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Archived",
  disabled = false,
  size = "md",
}) {
  const isActive = checked;
  const config = switchSizes[size] || switchSizes.md;

  return (
    <Switch
      size={size}
      color={isActive ? "success" : "warning"}
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
      }}
    />
  );
}
